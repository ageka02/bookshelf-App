
const books = [];
const RENDER_BOOK = "render-book";

const DUMMY_BOOKS = [
  {
    id: 123456789,
    title: 'The Has Slinging Slasher',
    author: 'Mike O Wen',
    year: 1997,
    isComplete: false
  },
  {
    id: 123456781,
    title: 'The Lighting Thief',
    author: 'Percy Jackson',
    year: 2003,
    isComplete: true
  },
  {
    id: 123456782,
    title: 'Full Dive into Virtual Reality Gaming',
    author: 'Kayaba',
    year: 2024,
    isComplete: false
  },
]

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage!");
    return false;
  }
  return true;
}

function addBook(event) {
  event.preventDefault();  

  const bookID = +new Date();
  const bookTitle = document.querySelector("#inputBookTitle").value;
  const bookAuthor = document.querySelector("#inputBookAuthor").value;
  const bookYear = document.querySelector("#inputBookYear").value;
  const bookIsComplete = document.querySelector("#inputBookIsComplete").checked;
 
  const booksData = {
    id: bookID,
    title: bookTitle,
    author: bookAuthor,
    year: Number(bookYear),
    isComplete: bookIsComplete,
  };

  books.push(booksData);

  Toast(`buku ${bookTitle} berhasil ditambahkan`)

  document.querySelector("#inputBookTitle").value = ''
  document.querySelector("#inputBookAuthor").value = ''
  document.querySelector("#inputBookYear").value = ''
  document.querySelector("#inputBookIsComplete").checked = false
  
  document.dispatchEvent(new Event(RENDER_BOOK));

}

function searchBook(event) {
  event.preventDefault();
  const searchBookTitle = document.querySelector("#searchBookTitle");
  const cari = searchBookTitle.value
  
  if (cari) {
    makeBooks(
      books.filter(function (books) {
        return books.title.toLowerCase().includes(cari.toLowerCase());
      })
    )
  }else{
    makeBooks(books)
  }
}

function makeBooks(booksObject) {
  const incompleteBookList = document.querySelector("#incompleteBookshelfList");
  const completeBookList = document.querySelector("#completeBookshelfList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const bookItem of booksObject) {
    const article = document.createElement("article");
    article.classList.add("book_item");

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = bookItem.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis: " + bookItem.author;

    const bookYear = document.createElement("p");

    const bookAction = document.createElement("div");
    bookAction.classList.add("action");
    if (
      ((bookYear.innerText = "Tahun: " + bookItem.year),
      article.appendChild(bookTitle),
      article.appendChild(bookAuthor),
      article.appendChild(bookYear),
      bookItem.isComplete)
    ) {
      const undoButton = document.createElement("button");
      undoButton.name = bookItem.title;
      undoButton.id = bookItem.id;
      undoButton.innerHTML = '<span class="iconify" data-icon="lets-icons:book-fill"></span> Belum dibaca';
      undoButton.classList.add("blue");
      undoButton.addEventListener("click", undoBookFromCompleted);

      const trashButton = document.createElement("button");
      trashButton.name = bookItem.title;
      trashButton.id = bookItem.id;
      trashButton.innerHTML = '<span class="iconify" data-icon="basil:trash-solid"></span> Hapus buku';
      trashButton.classList.add("red");
      trashButton.addEventListener("click", Dialog),

      bookAction.appendChild(undoButton),
      bookAction.appendChild(trashButton),
      article.appendChild(bookAction),
      completeBookList.appendChild(article);
    } else {
      const finishButton = document.createElement("button");
      finishButton.id = bookItem.id;
      finishButton.name = bookItem.title;
      finishButton.innerHTML = '<span class="iconify" data-icon="lets-icons:book-check-fill"></span> Selesai dibaca';
      finishButton.classList.add("green");
      finishButton.addEventListener("click", addBookToCompleted);

      const removeBooks = document.createElement("button");
      removeBooks.id = bookItem.id;
      removeBooks.name = bookItem.title;
      removeBooks.innerHTML = '<span class="iconify" data-icon="basil:trash-solid"></span> Hapus buku';
      removeBooks.classList.add("red");
      removeBooks.addEventListener("click", Dialog);

      bookAction.appendChild(finishButton),
        bookAction.appendChild(removeBooks),
        article.appendChild(bookAction),
        incompleteBookList.appendChild(article);
    }
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
}

function undoBookFromCompleted(data) {
  const todoTarget = findBook(Number(data.target.id));
  if (todoTarget == null) return;
  todoTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_BOOK));
  Toast(`Buku ${data.target.name} diset belum selesai dibaca`)
}

function Dialog(data) {
  let isConfirm = false
  
  const dialog = document.querySelector("dialog");  

  const textDialog = document.createElement('p')
  textDialog.innerHTML = `Yakin Mau Hapus <b > ${data.target.name} </b> ?`;
  
  const divAction = document.createElement('div')
  divAction.className = 'action'

  const closeDialog = document.createElement('button');
  closeDialog.innerText = 'Cancel'

  const confirmDialog = document.createElement('button');
  confirmDialog.setAttribute('autofocus','')
  confirmDialog.innerText = 'Confirm'
  confirmDialog.classList.add('red')

  divAction.append(closeDialog, confirmDialog)
  
  dialog.innerHTML = ''
  dialog.append(textDialog,divAction)
   
  
  dialog.showModal()

  confirmDialog.addEventListener("click", () => {  
    isConfirm = true
    dialog.close(isConfirm)
    removeBook(data)
  });
  
  // dialog.addEventListener("close", function () {
  //   console.log('ini return : '+dialog.returnValue)
  //   // isConfirm = Dialog.returnValue
  // })

  closeDialog.addEventListener("click", () => {
    dialog.close();
    console.log('close');    
});

}

function removeBook(data) {  
  // Dialog(data)
  
  console.log(`ini removebook ${data.target.id}`);
    const bookTarget = findBookIndex(Number(data.target.id));    
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    Toast(`buku ${data.target.name} telah dihapus`)
    document.dispatchEvent(new Event(RENDER_BOOK));
  
}

function addBookToCompleted(data) {
  const bookTarget = findBook(Number(data.target.id));
  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  Toast(`Buku ${data.target.name} selesai dibaca`)
  document.dispatchEvent(new Event(RENDER_BOOK));
}

function bookHandler() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem("books", parsed);
    makeBooks(books);
  }
}

function updateText() {
  const span = document.querySelector("span");  
    if (inputBookIsComplete.checked) {
        span.innerText = "selesai dibaca";
    } else {
        span.innerText = "belum selesai dibaca";
    }
}
document.addEventListener("DOMContentLoaded", function () {  
  const submitBook = document.getElementById("inputBook");
  const inputSearchBook = document.getElementById("searchBookTitle")
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");

  const data = JSON.parse(localStorage.getItem("books")) || [];
  console.log(data);
  console.log(data.length !== 0);
  const data_dummy = DUMMY_BOOKS  

  if (data.length !== 0) {
    for (const buku of data) {
      books.push(buku);
    }
  }else{
    const isUsingDummy = window.confirm('Apakah kamu mau menggunakan data Dummy?')
    if (isUsingDummy) {
      for (const dumBuku of data_dummy) {
        books.push(dumBuku)
      }      
      localStorage.setItem("books", JSON.stringify(books));
    }
  }
  console.log(books);
  makeBooks(books);

  submitBook.addEventListener("submit", addBook);
  inputBookIsComplete.addEventListener("input", updateText)  
  inputSearchBook.addEventListener("keyup", searchBook)
  document.addEventListener(RENDER_BOOK, bookHandler);

});


const coll = document.getElementsByClassName("collapsible");
let i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight+ 20 + "px";
    } 
  });
}


const init = () => {
  const node = document.createElement("section");
  node.classList.add("gui-toast-group");

  document.firstElementChild.insertBefore(node, document.body);
  return node;
};

const Toaster = init();

const createToast = (text) => {
  const node = document.createElement("output");

  node.innerText = text;
  node.classList.add("gui-toast");
  node.setAttribute("role", "status");

  return node;
};

const addToast = (toast) => {
  const { matches: motionOK } = window.matchMedia(
    "(prefers-reduce-motion: no-preference)"
  );

  Toaster.children.length && motionOK
    ? flipToast(toast)
    : Toaster.appendChild(toast);
};

const flipToast = (toast) => {
  const first = Toaster.offsetHeight;

  Toaster.appendChild(toast);

  const last = Toaster.offsetHeight;

  const invert = last - first;

  const animation = Toaster.animate(
    [{ transform: `translateY(${invert}px)` }, { transform: "translateY(0)" }],
    {
      duration: 150,
      easing: "ease-out",
    }
  );
};

const Toast = text => {
  let toast = createToast(text)
  addToast(toast)

  return new Promise(async (resolve, reject) => {
    await Promise.allSettled(
      toast.getAnimations().map(animation => 
        animation.finished
      )
    )
    Toaster.removeChild(toast)
    resolve() 
  })
}