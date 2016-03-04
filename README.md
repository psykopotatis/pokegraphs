# pokegraphs
Pokemon pixel color graphs in javascript.

http://www.pokegraphs.com

<strong>How do I run this locally?</strong>

You will need [Python](https://www.python.org) and [virtualenv](https://virtualenv.readthedocs.org/en/latest).

<ol>
    <li>
    Create isolated virtual Python environment<br/>
    <code>virtualenv venv</code>
    </li>

    <li>
    Start virtual environment<br/>
    <code>source venv/bin/activate</code>
    </li>

    <li>
    Install Django and all requirements<br/>
    <code>pip install -r requirements.txt</code>
    </li>
    
    <li>
    Apply migrations<br/>
    <code>python manage.py migrate</code>
    </li>

    <li>
    Starts a lightweight development Web server on the local machine<br/>
    <code>python manage.py runserver</code>
    </li>
</ol>

<strong>TL;DR</strong><br/>
<code>virtualenv venv;source venv/bin/activate;pip install -r requirements.txt;python manage.py migrate;python manage.py runserver</code>

To run webpack and recompile javascripts on change:

<ol>
    <li>
    Open another terminal. Install all npm dependencies<br/>
    <code>npm install</code>
    </li>
    
    <li>
    Start webpack watcher<br/>
    <code>webpack --progress --colors --watch</code>
    </li>
</ol>


