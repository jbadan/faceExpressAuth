#Facial Recognition App with Express and Tableau


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
