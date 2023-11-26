# Trails Through Shadows - Admin Dashboard

- Author: Pavel Mikula
- Version: 0.1.0

## Project Theme
This project is a sub-part of the Trails Through Shadows project. It is a web application that allows the user to manage the
data of the project. Using Django 4.2 and *[Volt Dashboard](https://appseed.us/product/volt-dashboard/django/)* template, we are able to create a
user-friendly and simple web application.

## ✨ How to use it

> Download the code

```bash
$ # Get the code
$ git clone https://github.com/Trails-Through-Shadows/TTS-Dashboard.git
$ cd TTS-Dashboard
```

> 👉 Set Up Virtual Environment

```bash
$ virtualenv env
$ source env/bin/activate
$ pip3 install -r requirements.txt
```

> Set Up Database

```bash
$ python manage.py makemigrations
$ python manage.py migrate
```

<br />

> Start the app

```bash
$ python manage.py runserver
$ gunicorn --bind 0.0.0.0:8000 core.wsgi:application
```

At this point, the app runs at `http://127.0.0.0:8000/`.

## ✨ Code-base structure

The project is coded using a simple and intuitive structure presented below:

```bash
< PROJECT ROOT >
   |
   |-- core/                               # Implements app configuration
   |    |-- settings.py                    # Defines Global Settings
   |    |-- wsgi.py                        # Start the app in production
   |    |-- urls.py                        # Define URLs served by all apps/nodes
   |
   |-- apps/
   |    |
   |    |-- home/                          # A simple app that serve HTML files
   |    |    |-- views.py                  # Serve HTML pages for authenticated users
   |    |    |-- urls.py                   # Define some super simple routes  
   |    |
   |    |-- authentication/                # Handles auth routes (login and register)
   |    |    |-- urls.py                   # Define authentication routes  
   |    |    |-- views.py                  # Handles login and registration  
   |    |    |-- forms.py                  # Define auth forms (login and register) 
   |    |
   |    |-- static/
   |    |    |-- <css, JS, images>         # CSS files, Javascripts files
   |    |
   |    |-- templates/                     # Templates used to render pages
   |         |-- includes/                 # HTML chunks and components
   |         |    |-- navigation.html      # Top menu component
   |         |    |-- sidebar.html         # Sidebar component
   |         |    |-- footer.html          # App Footer
   |         |    |-- scripts.html         # Scripts common to all pages
   |         |
   |         |-- layouts/                   # Master pages
   |         |    |-- base-fullscreen.html  # Used by Authentication pages
   |         |    |-- base.html             # Used by common pages
   |         |
   |         |-- accounts/                  # Authentication pages
   |         |    |-- login.html            # Login page
   |         |    |-- register.html         # Register page
   |         |
   |         |-- home/                      # UI Kit Pages
   |              |-- index.html            # Index page
   |              |-- 404-page.html         # 404 page
   |              |-- *.html                # All other pages
   |
   |-- requirements.txt                     # Development modules - SQLite storage
   |
   |-- .env                                 # Inject Configuration via Environment
   |-- manage.py                            # Start the app - Django default start script
   |
   |-- ************************************************************************
```
