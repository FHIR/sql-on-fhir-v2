# SQL on FHIR

## Motivation

* Modern relational databases got support for native json datatype.
* New SQL standard introduces json path

1. Persistent Format + reference impl of back and forth converter
2. 

## Getting Started

This repository is built using the [MkDocs](http://www.mkdocs.org/) static site generator. In order to run the site locally or build this project, you will need to [install Python 2.7.13+](http://docs.python-guide.org/en/latest/starting/installation/).

1. Clone the repository

```sh
$ git clone https://github.com/niquola/sql-on-fhir-2.git
```

2. Install the project dependencies

```sh
$ cd docs
$ pip install -r requirements.txt
```

3. Run the site locally

```sh
$ mkdocs serve
```

4. Using a browser, go to `http://127.0.0.1:8000/`

Anytime you make a change to the content within the site, your browser should automatically refresh to show your changes in real-time.
