# Overview

librarize it is a web application to sort your books into digital libraries. You can have different libraries just for your needs. The design is also responsive for smartphones so you can take your library wherever you go.

# User Stories

- **404:** As a user I want to see a 404 page if I try to reach a page that does not exist so that I know it's my fault
- **500:** As a user I want to see a 500 page if something goes wrong so that I know it's not my fault
- **Loading Screen:** As a user I want to see a loading screen so that I know that the page is doing something
- **Signup :** As a user I can sign up and get started with my first library
- **Login :** As a user I can login to access my profile and library
- **Logout :** As a user I can logout so no one else can use my account
- **Add library:** As a user I can create a new library and decide if it's public or private
- **View library:** As a user I can see my own libraries and the public ones of other users
- **Edit/Delete library:** As a user I can edit or delete my library
- **Add books:** As a user I can add books to my libraries
- **Add a status to books:** As a user I can create a status for a book (if I already read it, or just started, etc.)
- **Review books:** As a user I can review/rate books
- **Edit/Delete books:** As a user I can edit the status and rating of a book or delete the book from my library
- **Book detail:** As a user I can see the details of a selected book
- **Search Books:** As a user I can search for books with their ISBN
- **Sort books:** As a user I can sort books - **Backlog**
- **Get recommendations:** As a user I can get recommendations based on my read books - **Backlog**
- **Get in contact with other users:** As a user I can chat with other users about the books - **Backlog**
- **View my profile:** As a user I can view my profile with a list of my libraries
- **View other users profile:** As a user I can view the profile of other users and their libraries, that are set to public - **Backlog**
- **Edit/Delete my profile:** As a user I can edit my general information or delete my account

# Backlog

- Book status
- Book review/rating
- Book sorting
- Recommendations
- Barcode scanner
- Chat
- Reading challenges
- Add friends

# Client/Frontend

## Routes

| Path                          | Component                                        | Permissions | Behavior                                                                |
| ----------------------------- | ------------------------------------------------ | ----------- | ----------------------------------------------------------------------- |
| /                             | Navbar, LandingPage                              | public      | Homepage                                                                |
| /signup                       | Navbar, SignUp                                   | public      | Sign Up Form, navigate to profile after signed up                       |
| /login                        | Navbar, LogIn                                    | public      | Log In Form, navigate to profile after logged in                        |
| /profile/:id                  | Navbar, FooterNavigation, Profile                | user only   | Show User Profile                                                       |
| /settings                     | Navbar, FooterNavigation, EditProfile            | user only   | Edit User Information                                                   |
| /create-library               | Navbar, FooterNavigation, CreateLibrary          | user only   | Create a library                                                        |
| /profile/:id/library-overview | Navbar, FooterNavigation, LibraryOverview        | user only   | Show all libraries of the user                                          |
| /library/:id                  | Navbar, FooterNavigation, LibraryDetail, AddBook | user only   | Show the library with the books in it and give the option to add a book |
| /library/:id/edit             | Navbar, FooterNaviagtion, EditLibrary            | user only   | Edit the selected library                                               |
| /library/:libraryId/book/:id  | Navbar, FooterNavigation, BookDetail             | user only   | Show the details of the selected book                                   |
| /book-overview                | Navbar, FooterNavigation, BookOverview           | user only   | Show all books with ratings in database                                 |
| /book/:id                     | Navbar, FooterNavigation, BookOverviewDetail     | user only   | Shows the details of the book with average rating and reviews           |

## Components

- Navbar
- FooterNavigation
- LandingPage
- SignUp
- LogIn
- Profile
- EditProfile
- CreateLibrary
- EditLibrary
- LibraryOverview
- LibraryDetail
- BookDetail
- BookOverview
- BookOverviewDetail
- LoadingScreen
- NotFound
- InternalError

# Server/Backend

## Routes

| HTTP Method | URL                                 |
| ----------- | ----------------------------------- |
| POST        | /signup                             |
| POST        | /login                              |
| POST        | /logout                             |
| GET         | /user                               |
| GET         | /profile/:id                        |
| PATCH       | /profile/:id                        |
| DELETE      | /profile/:id/delete                 |
| PATCH       | /favorites                          |
| PATCH       | /view                               |
| POST        | /create-library                     |
| GET         | /library/:id                        |
| PATCH       | /library/:id                        |
| GET         | /library/:userId/:bookId            |
| DELETE      | /library/:id/delete                 |
| POST        | /add-book                           |
| GET         | /book/:id                           |
| PATCH       | /book/:id                           |
| PATCH       | /library/:libraryId/book/:id/delete |
| GET         | /book/:id/rating                    |
| POST        | /book/:id/rating                    |
| GET         | /book/:id/review                    |
| PATCH       | /book/:id/review                    |
| GET         | /book-overview                      |
| POST        | /upload                             |

## Models

- User:
  ```jsx
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: String,
    favorites: [
      {
        type: String,
        enum: [
          "Action and adventure",
          "Alternate history",
          "Anthology",
          "Art/architecture",
          "Autobiography",
          "Biography",
          "Business/economics",
          "Children's",
          "Classic",
          "Comic book",
          "Coming-of-age",
          "Crime",
          "Crafts/hobbies",
          "Cookbook",
          "Dictionary",
          "Drama",
          "Encyclopedia",
          "Fairytale",
          "Fantasy",
          "Graphic novel",
          "Guide",
          "Historical fiction",
          "Horror",
          "Health/fitness",
          "History",
          "Home and garden",
          "Humor",
          "Journal",
          "Math",
          "Memoir",
          "Mystery",
          "Paranormal romance",
          "Picture book",
          "Poetry",
          "Political thriller",
          "Philosophy",
          "Prayer",
          "Religion, spirituality, and new age",
          "Romance",
          "Review",
          "Satire",
          "Science fiction",
          "Short story",
          "Suspense",
          "Science",
          "Self help",
          "Sports and leisure",
          "Textbook",
          "True crime",
          "Travel",
          "Thriller",
          "Western",
          "Young adult",
        ],
      },
    ],
    grid: Boolean,
    libraries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Library",
      },
    ],
  },
  {
    timestamps: true,
  }
  ```
- Library:

  ```jsx
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    publicLibrary: Boolean,
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
  ```

- Book:

  ```jsx
  {
    title: {
      type: String,
      required: true,
    },
    author: Array,
    description: String,
    status: String,
    isbn13: {
      type: String,
      unique: true,
    },
    isbn10: {
      type: String,
      unique: true,
    },
    pages: Number,
    published: String,
    image: String,
    libraries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Library",
      },
    ],
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
  ```

  - RatingReview:

  ```jsx
    {
    ratingValue: Number,
    review: { value: String, created: Date, publicReview: Boolean },
    status: String,
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
  ```

# Links

### [Wireframes](https://whimsical.com/librarize-it-78GzekZoidRZW7XkBh87za)

### [Notion](https://www.notion.so/ed9213b008304d41a144fe3681e9efac?v=2fbe88c83c94441ea71458d657c965c6)

### [Google Slides](https://docs.google.com/presentation/d/1gumGjfCn1bbRsJMB7n6LvUa_OMaP2pHevz95I5ko-ow/edit?usp=sharing)

### [Github Client Side](https://github.com/tammidnight/librarize-it-client)

### [Github Server Side](https://github.com/tammidnight/librarize-it-server)

### [Deployment](http://librarize.it)
