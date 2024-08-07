## Flights

[[_TOC_]]

---

:scroll: **START**


### Introduction

Traveling to other countries has never been easier thanks to the popularization of plane travel.
Travelers use different web applications in order to search **flights** to their favorite destination.

---

### Task description

We are tasked with developing a small web application for managing **flights** information.

The **flight** has:
- code: unique, 6 characters long, allowed only uppercase or lowercase letters
- capacity: a number between 1 and 200
- departure date: the last date the plane took flight
- status: can be **none** (if there is no photo), **ready** (if the photo can be downloaded) or **processing** (if the photo is still not ready)
- img: if the flight has a photo it returns the image id for download

The **user** has:
- name: user's name
- email: user's email 
- password: user's password 

#### Backend Server

You will need to start the server before running the react app `npm run server`. Alternatively you can run it with `npx flights-server`
Please note that you may need to enable writing permission for the server directory in the node_modules so that it can run normally


### Requirements

#### Required features

1. Create a web page to display the first page and 10 items of the list of flights showing `code`, `capacity` and `departureDate` of each flight using a Table component to display data in a tabulated way. Ideally, the Table component should have configuration or prop where we can specify how each cell can be rendered and even using a custom html in it. You can use a tool like Postman or the swagger API to create flights on the server.
2. Add a navigation control that allows to change pages (optionally also to change the number of items per page).
3. Change the navigation element to update the url of the page when clicked and to show the correct page (and page size if implemented) when the browser page is refreshed.
4. Validate the parameters just added in the url to match the format accepted by the server for page (and page size) and redirect to a "Bad request" page in case the parameters are invalid.
5. Add a page or dialog and display a form that allows to create flights with the mentioned columns. Make sure the `code` is unique before sending.
6. Add a new control to this form with a file upload on the `photo` field. Restrict this new file upload only to images. Note that a binary is expected for the photo.
7. Add a preview to show the photo before submit when the user changes the value of this control.
8. Send this information to the server making sure to show a loading screen and closing the dialog (or navigating back to the list) only after the flight is created on the server. You might need to enable async file processing on the server for this.
9. Add an error strip in case the flight creation resulted in error and allow the user to retry the creation in the form again without having to retype all the information.
10. Add a column to display an icon in the cell that, when clicked, shows a preview of the image contained in the url in the `img` field on a dialog or nothing in the cell if the flight has no photo.
11. On small screen, display your data in cards instead of tabulated view. Document the component specifying how big is the small screen.
12. Create your own custom component for the cards. This component must be generic and allow to specify any custom content for the body. Build your own styles for this component. Also use scalable units based on font-size.
13. Add one unit test that check your page with mocked data from the server works.

#### Nice to have features

1. Add a progress bar on indefinite status or loader to this column cell if the property `status` of the flight is `processing` meaning you uploaded an image but is not ready yet.
2. Hide the flights table and show a loading indicator on its place when getting the flight information from the server or any other update operation.
3. Create your own custom component to display the tabular data with the possibility to render the cells with custom html
4. Add a column with a delete button on it that allows to delete flights by `id` on the server. This column must occupy have minimum width space except for some padding, and you must ask for confirmation before delete.
5. Add a search input on the flight list page that allows filtering by `code`.
6. Update the url as well to persist the user filter and validate it. If the user types an invalid code show an error on the search input and no results on the table.
7. When the user types in the search bar wait a few seconds after stopped typing to update the url and send the request to the server.
8. Add an edit button in the same column as the delete button next to it that allows to edit the properties of a flight except the photo. Again make sure the new code is unique or unchanged before sending.
9. Add the ability to add, update or remove the photo on a flight when editing.
10. Add a register screen that allows to create new users with `name`, `email` and `password` fields.
11. Add a login screen that allows to authenticate the user with `email` and `password`.
12. Enable security on the server and make all your request authenticated. Do not allow access to the application to users that are not registered.
13. Add a toolbar on top of your authenticated page showing the authenticated user with a menu with an option to logout. Make sure error pages also has this toolbar.
14. Create dark and light mode of your app. You can put the swithcher in the toolbar.


#### Special features

1. When the security credentials are expired redirect the user to the login screen.
2. If any flight visible on the screen has the photo in a pending state, query the server in the background on an interval and update the status if it changes.
3. Automatically refresh the tokens when they expire without login out the user.

---
:scroll: **END**
