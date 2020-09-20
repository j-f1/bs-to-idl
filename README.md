# bs-to-idl

> Extract the WebIDL definitions from Bikeshed (.bs) files

Usage:

```sh
node . my-file.bs > my-file.webidl
# or:
./from-github.sh github-url my-file.webidl
```

Example:

```sh
./from-github.sh https://github.com/whatwg/dom/blob/master/dom.bs console.webidl
```
