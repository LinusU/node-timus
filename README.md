# Timus helper app

This is a small app to help you complete the challenges at
[Timus Online Judge](http://acm.timus.ru).

## Installation

```sh
npm install -g timus
```

## Usage

```sh
timus <cmd>
```

### `checkout`

```sh
timus checkout <id>
```

Use this command to start working on a problem. It will create a directory and
fetch the test cases.

### `update`

```sh
timus update <id>
```

Use this command if you already have created a directory. It will only fetch the
test data and store it in the current directory.

### `build`

```sh
timus build
```

Build the current `main.c` file into an executable.

### `test`

```sh
timus test
```

Build `main.c` and run it against the fetched sample data.

### `login`

```sh
timus login <JudgeID> <Password>
```

Login to the server and save credentials.

### `submit`

```sh
timus submit
```

Submit `main.c` to the server and wait for solution verdict.

## License

MIT
