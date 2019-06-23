# aB-Scissors

I learn the best through practice. So when I first learnt adversarial search for Intro to AI, I struggled with minimax and alpha beta pruning. That is, until I actually did some questions and built an understanding through making mistakes and finding out why they were mistakes. The problem was that actual questions and answers were limited: this app addresses this by generating practice questions and answers. Additionally, it provides a way to check the answers for questions from past year papers. Since I worked on adversarial search for my AI project over the past semester, this was a natural application of that experience.

## Wireframing

I’ve opted with material design as a design language for its ubiquity. I was heavily inspired by the resources featured in this [medium post](https://medium.com/@kamushken/material-design-for-desktop-cdb74ce54a04); the designs showcase the sheer power of material design beyond web apps with intentionally simple user interfaces.

![Readme-wireframing-preview](/docs/assets/readme-wireframing-preview.png?raw=true)

## Requirements/Prototyping
This is pretty much a passion project at this stage, so I have not put much thought into requirements. The list may grow, but at this stage I want the application to:
1. Be static (and as lightweight as possible)
2. Be built in an extensible way 

After some exploration, I found [create-react-app](https://facebook.github.io/create-react-app/) suitable given the application's use case (as well as my inexperience with react...). [material-ui](https://material-ui.com/) also makes the job of implementing material design entirely painless, while [vx](https://vx-demo.now.sh/) (built on top of [d3](https://d3js.org/)) draws clean and largely customisable trees.

## Current Stage: Building
_More like: desperately attempting to squeeze an hour of dev time everyday while working a full-time internship_
