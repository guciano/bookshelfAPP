const books = [];
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APP"

document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('input-book');
    submitForm.addEventListener("submit", (event) => {
        event.preventDefault();
        addBook();
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

const addBook = () => {
    const bookTitle = document.getElementById('title').value;
    const authorBook = document.getElementById('author').value;
    const publishedAt = document.getElementById('year').value;
    const isCompleted = document.getElementById('check').checked;

    const generatedID = generatedId();
    const bookObj = generateBookObj(
        generatedID,
        bookTitle,
        authorBook,
        publishedAt,
        isCompleted
    );
    books.push(bookObj);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const generatedId = () => {
    return +new Date;
}

const generateBookObj = (id, title, author, year, isComplete) => {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

document.addEventListener(RENDER_EVENT, () => {
    const unreadBook = document.getElementById('incompleted-bookList');
    unreadBook.innerHTML = '';

    const readedBook = document.getElementById('completed-bookList');
    readedBook.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = bookList(bookItem);
        if (!bookItem.isComplete) {
            unreadBook.append(bookElement);
        }
        else {
            readedBook.append(bookElement);
        }
    }
});

const bookList = (bookObj) => {
    const bookTitle = document.createElement('h5');
    bookTitle.innerText = bookObj.title;

    const bookAuthor = document.createElement('h6');
    bookAuthor.innerText = bookObj.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = bookObj.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(bookTitle, bookAuthor, bookYear);

    const bookContainer = document.createElement('div');
    bookContainer.classList.add('item', 'shadow');
    bookContainer.append(textContainer);
    bookContainer.setAttribute('id', `bookList-${bookObj.id}`)

    if (bookObj.isComplete) {
        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');

        editButton.addEventListener('click', () => {
            editTaskFromCompleted(bookObj.id);

    });
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button')

    deleteButton.addEventListener('click', () => {
        deleteTaskFromCompleted(bookObj.id);
    });

    bookContainer.append(editButton, deleteButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', () => {
            taskCompleted(bookObj.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button')

        deleteButton.addEventListener('click', () => {
            deleteTaskFromCompleted(bookObj.id);
        });

        bookContainer.append(checkButton, deleteButton);
    }

    return bookContainer;
}

const taskCompleted = (bookId) => {
    const bookTarget = findBook(bookId);
    
    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const findBook = (bookId) => {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

const deleteTaskFromCompleted = (bookId) => {
    const bookTarget = findeBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const editTaskFromCompleted = (bookId) => {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const findeBookIndex = (bookId) => {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}


const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
});