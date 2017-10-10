# Theia
 A face detection app  that will detect one or more human faces and provide data visualization for face attributes using machine learning-based predictions of facial features. [View Site](https://theiafacialrecognition.herokuapp.com/).

# Demo

## Homepage
![Home 1](/public/img/demo/1.png)
![Home 2](/public/img/demo/2.png)
![Home 3](/public/img/demo/3.png)
![Home 4](/public/img/demo/4.png)
![Home 5](/public/img/demo/5.png)

## Profile
![Profile](/public/img/demo/6.png)

## Chart Display
![Check you out](/public/img/demo/7.png)
![Chart display](/public/img/demo/8.png)

# Technologies Used
* Express/Node
* [Microsoft Azure Face API](https://azure.microsoft.com/en-us/services/cognitive-services/face/)
* [Chart.js](http://www.chartjs.org/)
* [Cloudinary](https://cloudinary.com/)
* JQuery
* JQuery UI
* PostgreSQL
* Sequelize
* Bootstrap
* [Animate.css](https://daneden.github.io/animate.css/)
* [SpinKit](http://tobiasahlin.com/spinkit/)
* [FontAwesome](http://fontawesome.io/)

# Planning

![Page 1](/public/img/trello/trello1.png)
![Page 2](/public/img/trello/trello2.png)

# Routes
METHOD | URL | Purpose
--- | --- | ---
GET | / | Renders homepage (‘index’)
POST | / | Uploads image file to Cloudinary from homepage, renders “Check you out” page (‘display’) including new image information
GET | /auth/signup | Activates signup modal
POST | /auth/signup | Adds new user to user database, redirect to homepage upon completion (‘index’)
GET | /auth/login | Activates log in modal
POST | /auth/login | Authenticates login details, redirect to profile (‘profile/index’)
GET | /auth/logout | Ends session, redirect to homepage (‘index’)
GET | /profile | Finds logged in user in user database and includes image database, renders profile page (‘profile/index’) with user data and previously uploaded image data
POST | /profile |Uploads image file to Cloudinary from homepage, saves image data into image database, renders “Check you out” page (‘display’) including new image information
GET | /profile/display/:id | Receives id, finds image information in database via received id, renders “Check you out” page (‘display’) including active image information
POST | /profile/favorite/:id | Receives id, updates image database to change column “isFavorited” to true on received id, on complete, renders profile page (‘profile/index’) with full heart icon for image with received id
POST | /profile/unfavorite/:id | Receives id, updates image database to change column “isFavorited” to false on received id, on complete, renders profile page (‘profile/index’) with empty heart icon for image with received id
DELETE | /profile/:id | Receives an id, deletes image from image database that matched said id, redirects to profile page (‘profile/index’)

# Issues
* Unable to call Microsoft Face API from backend without key being blocked.

# Next Steps
* Fix sorting on profile page to display "favorited" images first
* Move API call to backend as request
* Reduce unnecessary code - CSS is not dry
* Find better way to toggle favorited pictures instead of using 2 post routes
* Replace image upload with [Cloudinary upload widget](https://cloudinary.com/documentation/upload_widget)
* Fix small styling bugs on mobile
