# 10x Speech
[![codecov](https://codecov.io/gh/cse110-sp25-group-10/Flashcard-Project/graph/badge.svg?token=DAKDEQDBUL)](https://codecov.io/gh/cse110-sp25-group-10/Flashcard-Project)

10x Speech is an app that helps users practice 
and study their speeches using cards.

The front of the card represents the topics covered 
in the speech. What the user has to say about each idea 
is written on the back of the card, making up a deck. 
Each deck represents an entire speech, and users can store 
multiple decks, being able to freely add, delete, or edit cards to existing decks.

With these decks, users can use the study mode to help remember their speech.

Users can flip through the cards, with the option of 
shuffling, to quiz themselves on the topic. Based off of the topic of the card, the user can try to recite what they wanted to speak about for the topic. There is also a timer to help pace the user, giving them insight into how fast or slow they are, letting them adjust their speech accordingly.

## Table of Contents
1. [Directory Structure](#directory-structure)
2. [Developer Documentation](#developer-documentation)
3. [Contributing Checklist](#contributing-checklist)
4. [npm Dependencies](#npm-dependencies)
5. [CI/CD Pipeline](#cicd-pipeline)

## Directory Structure
- The `.github/workflows` directory contains our GitHub actions files.
- The `__tests__` directory contains all tests - any `.js` file in it is ran during testing.
- The `assets` directory contains images and fonts used in the website.
- The `config` directory contains configuration files for code linters.
- The `scripts` directory contains all JavaScript used in our website.
- The `src` directory contains all HTML files used in our website.
- The `stylesheets` directory contains all CSS files used in our website.
- `package.json` contains all of our project's developer dependencies, and shortcuts for common useful scripts.

## Developer Documentation
Our developer documentation can be found [here](https://cse110-sp25-group-10.github.io/10x-Speech-Docs/).

## Contributing Checklist
There are many things to contribute to: tests, documentation, or anything under github issues. Whatever the case, the process will follow this timeline:

1. Clone the repo and install all of the node packages:

```bash
$ git clone https://github.com/cse110-sp25-group-10/10x-Speech.git
$ cd 10x-Speech
$ npm i
```
See [npm Dependencies](#npm-dependencies) to find out more about the packages installed.

2. Create a local branch to develop a feature in. The branch name should be short and say something about the feature being implemented. Don't stress about this, it's not that important.

```bash
$ git branch -m feature-implemented
```

3. Develop. As long as `npm run lint` and `npm test` work, you should be able to pass the github actions triggered by a pull request. See [npm Dependencies](#npm-dependencies) for more information, or if these commands don't work.

4. Commit, add, and push to a remote branch.
```bash
$ git add <your files>
$ git commit <you know how to do this I hope>
$ git push feature-implemented
```

5. Open a pull request to main. This will trigger GitHub actions that see if `npm run lint` and `npm test` pass.

6. Once GitHub actions pass and one other person approves your code, then the pull request will go through, and your contribution will be seen on the main branch!

## npm Dependencies
If you look in `package.json`, you will find our dependencies, scripts to run common commands, and some configs for specific packages.

If you can't run the scripts, then it's likely because you are using a shell other than bash. To make bash the default shell for npm commands, see [this](https://stackoverflow.com/questions/23243353/how-to-set-shell-for-npm-run-scripts-in-windows) stackexchange post for windows users. For mac users, the process is roughly the same.

Git comes with a bash executable, so just run 

```bash
npm config set script-shell "C:\\Program Files (x86)\\git\\bin\\bash.exe" 
```

or wherever your `git/bin/bash` is and the scripts should work. DM me (Alex) on slack if they don't.

When you run `npm i` from the root of the project, the following packages will be installed:

### Linters
- [ESLint](https://eslint.org/)
    - JavaScript linter. This is most easily accessed through `npm run jslint`. This command runs `npx eslint -c config/eslint.config.mjs`. This runs eslint, and says the config files is `config/eslint.eslint.mjs`.
- [Stylelint](https://stylelint.io/)
    - CSS Linter. This is accessed through `npm run csslint`. This command runs `npx stylelint stylesheets/ -c config/stylelint.config.js`. This runs stylelint on the `stylesheets/` directory, with config file `config/stylelint.config.js`
- [HtmlHint](https://htmlhint.com/)
    - HTML Linter. This is accessed through `npm run htmllint`. This command runs `npx htmlhint -i **/docs/** -i **/coverage/** -c config/.htmlhintrc`. This runs htmlhint, tells it to ignore the docs/ and coverage/ directories, with config file `config/.htmlhintrc`

The command `npm run lint` runs all three of these linters in succession.

### Testing
- [Jest](https://jestjs.io/)
    - JS Testing framework, ran using `npm test`
- [Codecov](https://about.codecov.io/)
    - Code coverage tool. Basically, whenever tests are run, codecov points out which lines in our codebase weren't run by the tests. If a section of code wasn't run by a test, then we should make tests that cover that part of code.
- [Puppeteer](https://pptr.dev/)
    - Library for E2E testing.

### Documentation
- [https://jsdoc.app/](JSDoc)
    - Documentation generating package, ran using `npm run docs`. For now this is only updated locally, in the future there will be a separate branch of this repo specifically for docs that we can access online

## CI/CD Pipeline
We go into depth about our CI/CD Pipeline [here](https://github.com/cse110-sp25-group-10/cse110-sp25-group10/blob/main/admin/cipipeline/final-pipeline.md).
Below is a graphic that illustrates it at a high level:
![ci-cd pipeline](https://raw.githubusercontent.com/cse110-sp25-group-10/cse110-sp25-group10/main/admin/cipipeline/final-pipeline.png "ci-cd pipeline")