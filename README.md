Create word site seacher which receive from command line 3 arguments: start link, depth level (how deep the seacher goes though inner links) and search phrase (1 - 5 words), and append to the file result.txt a line with found data: url and number of hits.

Example:

`node index.js  https://en.wikipedia.org/wiki/Dog 3 intelligence`

//result.txt

`https://en.wikipedia.org/wiki/Dog 10
https://en.wikipedia.org/wiki/Dog_intelligence 16
https://en.wikipedia.org/wiki/Siberian_Husky 1
https://en.wikipedia.org/wiki/Working_dog 1`
