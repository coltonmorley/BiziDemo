import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Note } from '../types/note'

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  public notes: Note[] = [];
  public loaded: boolean = false;

  constructor(private storage: StorageService) {
  }

  load(): Promise<boolean> {

    // Return a promise so that we know when this operation has completed
    return new Promise((resolve) => {

      // Get the notes that were saved into storage
      this.storage.getData('notes').then((notes) => {

        // Only set this.notes to the returned value if there were values stored
        if(notes != null){
          this.notes = notes;
        }

      // This allows us to check if the data has been loaded in or not
      this.loaded = true;
      resolve(true);

      });

    });

  }

  save(): void {
    // Save the current array of notes to storage
    this.storage.setData('notes', this.notes);
  }

  getNote(id): Note {
    // Return the note that has an id matching the id passed in
    return this.notes.find(note => note.id === id);
  }
  createNote(title: string): void {

    // Create a unique id that is one larger than the current largest id
    let id = Math.max(...this.notes.map(note => parseInt(note.id)), 0) + 1;

    this.notes.push({
      id: id.toString(),
      title: title,
      content: ''
    });

    this.save();
  }

  deleteNote(note): void {

    // Get the index in the array of the note that was passed in
    let index = this.notes.indexOf(note);

    // Delete that element of the array and resave the data
    if(index > -1){
      this.notes.splice(index, 1);
      this.save();
    }

  }
}
