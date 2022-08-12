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

  /**
   * Calls the getAllToDos function.
   */
  ngOnInit(): void {

    this.getAllToDos();

  }

  /**
   * Gets all toDos from the firestore database and calls the sortToDos function in order to sort them according to their creation date.
   */
  getAllToDos() {
    
    //Not only gets all toDos from the firestore database, but also sets for each toDo the property "customIdName" (this property comes
    //from the firestore database). It is important to note that, although this property comes from the firestore database, a property with
    //the same name must be defined in the toDo class so that the one coming from the firestore database is correctly assigned to each toDo.
    //In other words, if a property called 'customIdName' is not defined in the toDo class, the 'customIdName' coming from the firestore 
    //database is not assigned to the toDos in the app and, therefore, it cannot be used in other functions (as for example in the 
    //deleteToDo function, where it is crucial to have the 'customIdName' of the to-be-deletedtoDo to be able to delete it from the 
    //firestore database).
    this.fireStore.collection('toDos').valueChanges({ idField: 'customIdName' }).subscribe((toDos: any) => {

      this.toDos = toDos;

      this.sortToDos();

      console.log(this.toDos);

    });

  }

  /**
   * Sorts all toDos according to their creation date.
   */
  sortToDos() {

    this.toDos.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));

  }

  /**
   * Creates a new toDo taking as content the value of the inputToDo (what the user types in this input) and adds it to the collection of 
   * toDos in the firestore database.
   */
  addToDo() {

    //If the user clicks the "Add toDo" button without first typing anything in the inputToDo...
    if (this.inputToDo.length == 0) {

      //An alert telling the user he/she must type something in order to create a new toDo is displayed.
      alert('You need to write a toDo in order to add a new element to the list');

    //If the inputToDo is not empty when the user clicks the "Add toDo" button...
    } else {

      //A new toDo is created...
      let newToDo = {
        createdAt: this.getTimeInSeconds(),
        content: this.inputToDo,
        completed: false,
      }

      //And added to the toDos collection.
      this.fireStore.collection('toDos').add(newToDo).then(() => {

        //Cleans the inputToDo.
        this.inputToDo = "";

        //Ensures that the new toDo occupies the last position in the list.
        this.sortToDos();

      });

    }

  }

  /**
   * Gets the current date/time in seconds.
   * @returns - the current date/time in seconds.
   */
  getTimeInSeconds() {

    let seconds = new Date().getTime() / 1000;

    return seconds;

  }

  /**
   * Sets the state of the passed-in toDo (the toDo whose id and customIdName match the those passed in) to "completed" or "uncompleted"
   * depending on the current state of the toDo.
   * @param id - This is the passed-in id;
   * @param customIdName - This is the passed-in customIdName.
   */
  toggleCompleted(id: number, customIdName: string | undefined) {

    //If the current state of the passed-in toDo is "uncompleted"...
    if (!this.toDos[id].completed) {

      //Its state value is set to "completed".
      this.fireStore.collection('toDos').doc(customIdName).update({

        "completed": true

      });

    //If the current state of the passed-in toDo is "completed"...
    } else {

      //Its state value is set to "uncompleted".
      this.fireStore.collection('toDos').doc(customIdName).update({

        "completed": false

      });

    }

  }

  /**
   * Deletes from the firestore databes the passed-in toDo (the toDo whose customIdName matches the one passed in).
   * @param customIdName - This is the passed-in customIdName.
   */
  deleteToDo(customIdName: string | undefined) {

    this.fireStore.collection('toDos').doc(customIdName).delete();

  }

}