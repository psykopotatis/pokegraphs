# pokegraphs
Pokemon pixel color graphs in javascript.

http://www.pokegraphs.com

<strong>How do I run this locally?</strong>

You will need [Python](https://www.python.org) and [virtualenv](https://virtualenv.readthedocs.org/en/latest).

*    Create isolated virtual Python environment<br/>
    <code>virtualenv venv</code>

*   Start virtual environment<br/>
    <code>source venv/bin/activate</code>

*    Install Django and all requirements<br/>
    <code>pip install -r requirements.txt</code>
    
*    Django: Start lightweight development Web server on the local machine<br/>
    <code>python manage.py runserver</code>
    
*    Your shiny new pokegraphs site should live here! :D<br/>
    http://127.0.0.1:8000  

<strong>TL;DR</strong><br/>
<code>virtualenv venv;source venv/bin/activate;pip install -r requirements.txt;python manage.py runserver</code>

<strong>webpack</strong><br/>

To run webpack and recompile javascripts on change:

*    Open another terminal. Install all npm dependencies<br/>
    <code>npm install</code>

*    Start webpack watcher<br/>
    <code>npm run dev</code>


