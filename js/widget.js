(function() {
"use strict";

var appView;

// Class Book
function Book(name, date) {
    this.name = name;
    this.date = date;
    this.count = 1;
    this.type = 'Book';

    // increases the count
    this.increase = function() {
        this.count++;
    };
}


// Class Encyclopedia extends from Book
Encyclopedia.prototype = new Book();
function Encyclopedia(name, date, year){
    Book.apply(this, arguments);
    this.year = year;
    this.type = 'Encyclopedia';
}


// Class Books
function Books() {
    this.books = [];

    // returns with Books.books array
    this.get = function() {
        return this.books;
    };

    // adds a new Book to the Books.book array
    this.add = function(name, date, year) {
        var isNewBook = true;
        // check if already in the array
        for (var i = 0; i < this.books.length; i++) {
            if ((this.books[i].name === name) && (this.books[i].date === date) && (this.books[i].year === year)) {
                isNewBook = false;
                this.books[i].increase();
            }
        }
        // add the input as a Book or as an Encyclopedia
        if (isNewBook) {
            var newBook;
            if (typeof year === 'undefined') {
                newBook = new Book(name, date);
            } else {
                newBook = new Encyclopedia(name, date, year);
            }
            this.books.push(newBook);
        }
    };
}

// Class BooksView
function BooksView (el) {
    var self = this;
    this.el = el;

    // adds the item to the DOM
    this.addToDOM = function(book) {
        var li = document.createElement('li');

        var nameText = document.createTextNode(book.name);
        var nameSpan = document.createElement('span');
        nameSpan.setAttribute('class','name');
        nameSpan.appendChild(nameText);
        li.appendChild(nameSpan);

        var yearText = document.createTextNode('(' + book.year + ')');
        var yearSpan = document.createElement('span');
        yearSpan.setAttribute('class','year');
        yearSpan.appendChild(yearText);
        li.appendChild(yearSpan);

        var countText = document.createTextNode('[' + book.count + ']');
        var countSpan = document.createElement('span');
        countSpan.setAttribute('class','count');
        countSpan.appendChild(countText);
        li.appendChild(countSpan);

        var dateText = document.createTextNode(book.date);
        var dateSpan = document.createElement('span');
        dateSpan.setAttribute('class','date');
        dateSpan.appendChild(dateText);
        li.appendChild(dateSpan);

        document.getElementById(this.el).appendChild(li);
    };

    // removes previous DOM nodes from BooksView
    this.emptyDOM = function() {
        var ol = document.getElementById(self.el);
        if (ol.hasChildNodes()) {
            while (ol.childNodes.length >= 1) {
                ol.removeChild(ol.firstChild);
            }
        }
    };

    // sort books by name
    this.sortBooks = function(books) {
        function compareBooks(a, b) {
            var aName = a.name.toLowerCase( );
            var bName = b.name.toLowerCase( );
            if (aName < bName) {
                return -1;
            }
            if (aName > bName) {
                return 1;
            }
            return 0;
        }
        books.sort(compareBooks);
    };

    // render Books.books if it is Encyclopedia
    this.renderBooks = function(books) {
        // sort books by name
        self.sortBooks(books);

        // remove children nodes before render
        self.emptyDOM();

        // render nodes
        for (var i = 0; i < books.length; i++) {
            if (books[i].type === 'Encyclopedia') {
                self.addToDOM(books[i]);
            }
        }
    };
}


// Class FormView
function FormView (el) {
    var self = this;
    this.el = el;
    this.form = document.getElementById(this.el);
    this.submitBtn = this.form.elements['input-submit'];
    this.nameField = this.form.elements['input-name'];
    this.dateField = this.form.elements['input-date'];
    this.yearField = this.form.elements['input-year'];
    this.yearDiv = document.getElementById('input-div');
    this.moreDiv = document.getElementById('input-more');
    this.moreLink = document.getElementById('input-more-link');

    // validate form
    this.validateForm = function() {
        var returnValue = true;
        if (!this.nameField.value.length) {
            this.nameField.setAttribute('class', 'error');
            returnValue = false;
        } else {
            this.nameField.removeAttribute('class');
        }
        if (!this.dateField.value.length) {
            this.dateField.setAttribute('class', 'error');
            returnValue = false;
        } else {
            this.dateField.removeAttribute('class');
        }
        return returnValue;
    };

    // submit form
    this.submitForm = function() {
        if (self.yearField.value.length) {
            appView.books.add(self.nameField.value, self.dateField.value, self.yearField.value);
        } else {
            appView.books.add(self.nameField.value, self.dateField.value);
        }
        self.nameField.value = '';
        self.dateField.value = '';
        self.yearField.value = '';
        self.yearDiv.setAttribute('style', 'display:none');
        self.moreDiv.removeAttribute('style');
        self.submitBtn.setAttribute('value', 'Add book');
    };

    // show extra fields if the input is encyclopedia
    this.showMore = function() {
        var d = new Date();
        self.yearDiv.removeAttribute('style');
        self.moreDiv.setAttribute('style', 'display:none');
        self.yearField.value = d.getFullYear();
        self.submitBtn.setAttribute('value', 'Add encyclopedia');
    };
}


// class AppView
function AppView() {
    var self = this;

    // initalization
    this.books = new Books();
    this.booksView = new BooksView('encyclopedia');
    this.formView = new FormView('add-book');

    // uploade some data
    this.books.add('Rum Diary', '27-01-2012', '1998');
    this.books.add('Rum Diary', '27-01-2012');
    this.books.add('Rum Diary', '27-01-2012', '1998');
    this.books.add('Fear And Loathing in Las Vegas', '01-02-2012', '1972');

    // render the initial data
    this.booksView.renderBooks(this.books.get());

    // place event handler on the submit button
    this.formView.submitBtn.onclick = function(e){
        e.preventDefault();
        var valid = self.formView.validateForm();
        if (valid) {
            self.formView.submitForm();
            self.booksView.renderBooks(self.books.get());
        }
    };

    // place event handler on the a tag
    this.formView.moreLink.onclick = function(e){
        e.preventDefault();
        self.formView.showMore();
    };
}


// initialize the app
window.onload = function(){
    appView = new AppView();
};

})();
