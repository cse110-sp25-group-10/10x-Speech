# Flashcard-Project
## Checkpoint 1
[YouTube Link](https://youtu.be/rDQnm-aopik)

Name of the repo to be changed

## DevOps stuff
In short, this is how pushing code to main will happen:

To start, clone the repo and install all of the node packages:

```bash
$ git clone https://github.com/cse110-sp25-group-10/Flashcard-Project.git
$ npm i
```
fasdfasfas
I'm not exactly sure how npm package versioning works, but 
as long as your node is fairly up-to-date everything should be fine (I will look into this more later).

A few packages will have been installed as dev dependencies. The list is:

- ESLint (`npm run jslint`)
    - A JavaScript linter. The config is in eslint.config.mjs. Right now, all I have it doing is ensuring camelcase on top of all of the checking it already does for JS.

- Stylelint (`npm run csslint`)
    - CSS linter. We don't really have CSS coding guidelines, so Stylelint's default settings are now our guidelines

- HTMLHint (`npm run htmllint`)
    - HTML linter.

To just run all linters, we also have `npm run lint`

- Jest (`npm test`)
    - JS testing framework. We know about this already, tests go in `/__tests__` and it runs all of them.

- JSDocs (`npm run docs` to generate docs in /docs directory)
    - Generates documentation. See /scripts/add.js for example of how it works. Run /docs/index.html to see the documentation it generates. Live server on vscode is weird so you'll probably have to open a new vscode window to run it. There are also [tutorials](https://medium.com/@martink_rsa/js-docs-a-quickstart-guide-da6ce5df4a73) online on how to document code with JSDocs

I had some issues with CI/CD stuff for generating documentation automatically, for now just try to `npm run docs` before every pull request

Back to pushing to main, this is the process:

1. Create a local branch to implement a feature in:

```bash
$ git branch -m your-branch-name
```
Let's try to make our branch naming conventions clear and consistent. So, let's stick to `<name>/<short-description>`. So, if I (Alex) wanted to make a pull request to fix the `add` function, my command would be `git branch -m alex/add-fix`

2. Code. As long as `npm test` and `npm run lint` both don't error, github actions won't get mad at you.

3. `git add` stuff, `git commit` stuff (we should have a discussion about commit message format)

4. `git push -u origin your-branch-name` or whatever you changed origin to

5. Open a pull request to main. Select a size label (available ones are size::s, size::m, size::l). This decides how many people will have to review your code in order for the human review status check to pass. I trust that everyone uses size appropriately

6. Once the appropriate number of people approve your code, run the human review action again, and it should pass. Now, you can click the merge button!
