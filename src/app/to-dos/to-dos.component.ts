import { Component, OnInit } from '@angular/core';
import { toDo } from '../../models/toDo.class';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import * as firebase from 'firebase/compat';


@Component({
  selector: 'app-to-dos',
  templateUrl: './to-dos.component.html',
  styleUrls: ['./to-dos.component.scss']
})
export class ToDosComponent implements OnInit {

  /**
   * This links the "toDo" class to this file. In this case we create an array of "toDo" objects. 
   * Each object in the array has the properties of the "toDo" class.
   */
  toDos!: toDo[];

  inputToDo: string = "";

  constructor(private fireStore: AngularFirestore) { }

  ngOnInit(): void {
    this.toDos = [
      {
        content: "First toDo",
        completed: false
      },
      {
        content: "Second toDo",
        completed: false
      },
      {
        content: "Third toDo",
        completed: false
      }
    ]
  }

  /**
   * This function, called when the user clicks on any element of the list, loops through all "toDo" objects and checks if the index of 
   * the object matches the id the user passes through (which always does), and if so it sets the "toDo" to "completed". If the user clicks
   * again on the same element of the list, this function will set this time the task to "uncompleted" (like in its original status).
   * @param id -This is the index of the "toDo".
   */
  toggleDone(id: number) {
    this.toDos.map((v, i) => {
      if (i == id) v.completed = !v.completed;
      return v;
    });
  }

  /**
   * This function, called when the user clicks on any "remove" button, generates a new array of "toDo" objects meeting the condition 
   * "i !==id". That is, an array with the objects whose index does not match the id of the object on which the user clicks. 
   * That way only the "toDo" on which the user clicks is not included in the new array (and therefore is deleted).
   * @param id -This is the index of the "toDo".
   */
  deleteToDo(id: number) {
    this.toDos = this.toDos.filter((v, i) => i !== id);
  }


  /**
   * This function, called when the user clicks on "Add toDo" adds the content of the input to the content of the "toDo" object 
   * and automatically classifies this new element as "not complete". It then empties the input field.
   */
  addToDo() {
    if (this.inputToDo.length == 0) {
      alert('You need to write a toDo in order to add a new element to the list');
    } else {
      this.toDos.push({
        content: this.inputToDo,
        completed: false
      });
      this.inputToDo = "";
    }
  }

  add1stTodo() {
    this.fireStore.collection('toDos').add(this.toDos[0]).then(() => {
      console.log(this.fireStore.collection('toDos'));
    });
  }

  add2ndTodo() {
    this.fireStore.collection('toDos').add(this.toDos[1]).then(() => {
      console.log(this.fireStore.collection('toDos'));
    });
  }

  retreiveCollection() {
    this.fireStore.collection('toDos').valueChanges().subscribe((changes: any) => {
      console.log(changes.length);
    }); 
  }

  //this.firestore.collection('toDos').doc(this.userId).delete(); --> to delete toDos.
}
