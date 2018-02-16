# Monty Components 'Builder' Prototype

This is a prototype components builder in ECMC. Simple forms that read in, and write out JSON objects into ECMC. Simple dependencies, currently using FROALA WYSIWYG editor (uses jQuery). Everything else is intended to be written in vanilla javascript.

Intentions are to isolate code dependencies for components that require them.

Node and Handlebars, are used for structure and compilation. Static files (for now) have to be rendered and stored on the ECMC server.

## Running the project.

Clone this repo and run:

```
npm install
```
This will install all of the dependencies.


```
gulp --dev
```

This will start gulp and run a local server instance.
