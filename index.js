const http = require('http')
const url = require('url')
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')




const server = http.createServer((req, res) => {

    const pathname = url.parse(req.url, true).pathname

    res.statusCode = 200

    res.setHeader('Content-Type', 'text/html')

    //CSS

    if (pathname.startsWith('/styles/')) {
        const cssPath = path.join(__dirname, 'views', pathname)
        fs.readFile(cssPath, (err, data) => {
            if (err) {
                res.statusCode = 404
                res.end('Error : file not found')
            } else {
                res.setHeader('Content-Type', 'text/css')
                res.end(data)
            }
        })
        return
    }

    //IMG

    if (pathname.startsWith('/img/')) {
        const imgPath = path.join(__dirname, 'public', pathname)
        fs.readFile(imgPath, (err, data) => {
            if (err) {
                console.log(err)
                res.statusCode = 404
                res.end('Error : image not found')
            }
            else {
                const ext = path.extname(pathname).slice(1);
                const contentType = `image/${ext}`;
                res.setHeader('Content-Type', contentType);
                res.end(data);
            }
        })
        return
    }

    let jsonFilePath
    
        //ROUTES

        switch (pathname) {
            case '/':
                ejs.renderFile('views/home.ejs', {}, {}, (err, str) => {
                    if (err) {
                        console.log(err);
                    }
                    res.end(str);
                });
                break;

            case '/destinations':

                jsonFilePath = path.join(__dirname, 'japon.json')

                fs.readFile(jsonFilePath, (err, data) => {
                    if (err) {
                        console.log(err)

                    }

                    const destinationsData = JSON.parse(data)

                    ejs.renderFile('views/destinations.ejs', { destinationsData: destinationsData },{}, {}, (err, str) => {
                        if (err) {
                            console.log(err)
                        }
                        res.end(str)
                    })

                })
                break;

            case '/singleDestination':
                const destinationId = parseInt(url.parse(req.url, true).query.id)
                jsonFilePath = path.join(__dirname, 'japon.json')

                fs.readFile(jsonFilePath, (err, data) => {
                    if (err) {
                        console.log(err)
                    }

                    const destinationsDataSingle = JSON.parse(data)
                    const singleDestinationData = destinationsDataSingle.find(destination => destination.id === destinationId)

                    ejs.renderFile('views/singleDestination.ejs', { singleDestinationData: singleDestinationData }, {}, {}, (err, str) => {
                        if (err) {
                            console.log(err)
                        }
                        res.end(str)
                    })
                })
                break;

            case '/contacts':
                ejs.renderFile('views/contact.ejs', {}, {}, (err, str) => {
                    if (err) {
                        console.log(err);
                    }
                    res.end(str);
                });
                break;

            case '/login':
                ejs.renderFile('views/login.ejs', {}, {}, (err, str) => {
                    if (err) {
                        console.log(err);
                    }
                    res.end(str);
                });
                break;

            default:
                res.statusCode = 404;
                res.end('Page not found')
        }
    })
// })

server.listen(8080, () => {
    console.log('server is running on 8080')
})

