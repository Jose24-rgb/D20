const API_URL = "https://striveschool-api.herokuapp.com/books";
const bookList = document.getElementById("book-list");
const cartList = document.getElementById("cart-list");
const cartCount = document.getElementById("cart-count");
const searchInput = document.getElementById("searchInput");
const clearCartBtn = document.getElementById("clear-cart");
let cart = [];

function fetchBooks() {
    fetch(API_URL)
        .then(response => response.json())
        .then(books => renderBooks(books));
}

function renderBooks(books) {
    bookList.innerHTML = "";
    books.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("col-md-4");
        bookCard.innerHTML = `
            <div class="card mb-4 shadow-sm">
                <img src="${book.img}" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">${book.price}€</p>
                    <button class="btn btn-success add-to-cart" data-id="${book.asin}">Aggiungi al carrello</button>
                    <button class="btn btn-danger skip-book">Salta</button>
                </div>
            </div>
        `;
        bookList.appendChild(bookCard);
    });
}

function updateCart() {
    cartList.innerHTML = "";
    cart.forEach(book => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = `${book.title} - ${book.price}€ <button class="btn btn-sm btn-danger remove-from-cart" data-id="${book.asin}">Rimuovi</button>`;
        cartList.appendChild(li);
    });
    cartCount.innerText = cart.length;
}

bookList.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
        const bookId = e.target.getAttribute("data-id");
        fetch(API_URL)
            .then(response => response.json())
            .then(books => {
                const book = books.find(b => b.asin === bookId);
                if (book && !cart.some(item => item.asin === book.asin)) {
                    cart.push(book);
                    updateCart();
                }
            });
    }
});

cartList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-from-cart")) {
        const bookId = e.target.getAttribute("data-id");
        cart = cart.filter(book => book.asin !== bookId);
        updateCart();
    }
});

clearCartBtn.addEventListener("click", () => {
    cart = [];
    updateCart();
});

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    if (query.length > 3) {
        fetch(API_URL)
            .then(response => response.json())
            .then(books => {
                const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
                renderBooks(filteredBooks);
            });
    } else {
        fetchBooks();
    }
});

fetchBooks();
