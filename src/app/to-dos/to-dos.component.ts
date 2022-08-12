import { Component, OnInit } from '@angular/core';
import { toDo } from '../../models/toDo.class';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import * as firebase from 'firebase/compat';


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
    this.retreiveCollection();
  }

  /**
   * This function, called when the user clicks on any element of the list, loops through all "toDo" objects and checks if the index of 
   * the object matches the id the user passes through (which always does), and if so it sets the "toDo" to "completed". If the user clicks
   * again on the same element of the list, this function will set this time the task to "uncompleted" (like in its original status).
   * @param id -This is the index of the "toDo".
   */
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

  /**
   * This function, called when the user clicks on any "remove" button, generates a new array of "toDo" objects meeting the condition 
   * "i !==id". That is, an array with the objects whose index does not match the id of the object on which the user clicks. 
   * That way only the "toDo" on which the user clicks is not included in the new array (and therefore is deleted).
   * @param id -This is the index of the "toDo".
   */
  deleteToDo(customIdName: string | undefined) {
    //this.toDos = this.toDos.filter((v, i) => i !== id);

    console.log(customIdName);

    this.fireStore.collection('toDos').doc(customIdName).delete();
  }


  /**
   * This function, called when the user clicks on "Add toDo" adds the content of the input to the content of the "toDo" object 
   * and automatically classifies this new element as "not complete". It then empties the input field.
   */
  addToDo() {
    if (this.inputToDo.length == 0) {
      alert('You need to write a toDo in order to add a new element to the list');
    } else {

      let newToDo = {
        content: this.inputToDo,
        completed: false,
      }

      this.fireStore.collection('toDos').add(newToDo).then(() => {
        this.inputToDo = "";
      });

    }
  }

  retreiveCollection() {
    //"{idField: 'customIdName'}"
    this.fireStore.collection('toDos').valueChanges({ idField: 'customIdName' }).subscribe((toDos: any) => {
      this.toDos = toDos;
    });
  }

  //this.firestore.collection('toDos').doc(this.userId).delete(); --> to delete toDos.
}
