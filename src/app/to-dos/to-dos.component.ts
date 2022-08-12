import { Component, OnInit } from '@angular/core';
import { toDo } from '../../models/toDo.class';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-to-dos',
  templateUrl: './to-dos.component.html',
  styleUrls: ['./to-dos.component.scss']
})
export class ToDosComponent implements OnInit {

  toDos!: toDo[];

  inputToDo: string = "";

  constructor(private fireStore: AngularFirestore) { }

  ngOnInit(): void {

    this.getAllToDos();

  }

  getAllToDos() {
    
    this.fireStore.collection('toDos').valueChanges({ idField: 'customIdName' }).subscribe((toDos: any) => {

      this.toDos = toDos;

      this.sortToDos();

    });

  }

  sortToDos() {

    this.toDos.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));

  }

  addToDo() {

    if (this.inputToDo.length == 0) {

      alert('You need to write a toDo in order to add a new element to the list');

    } else {

      let newToDo = {
        createdAt: this.getTimeInSeconds(),
        content: this.inputToDo,
        completed: false,
      }

      this.fireStore.collection('toDos').add(newToDo).then(() => {

        this.inputToDo = "";

        this.sortToDos();

      });

    }

  }

  getTimeInSeconds() {

    let seconds = new Date().getTime() / 1000;

    return seconds;

  }

  toggleCompleted(i: number, customIdName: string | undefined) {

    if (!this.toDos[i].completed) {

      this.fireStore.collection('toDos').doc(customIdName).update({

        "completed": true

      });

    } else {

      this.fireStore.collection('toDos').doc(customIdName).update({

        "completed": false

      });

    }

  }

  deleteToDo(customIdName: string | undefined) {

    this.fireStore.collection('toDos').doc(customIdName).delete();

  }

}