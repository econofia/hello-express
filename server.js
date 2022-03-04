/**
* This is the main Node.js server script for your project
* Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
*/

const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE


// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("fastify-formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

/**
* Our home page route
*
* Returns src/pages/index.hbs with data built into it
*/
fastify.get("/", function(request, reply) {
  
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };
  
  // If someone clicked the option for a random color it'll be passed in the querystring
  if (request.query.randomize) {
    
    // We need to load our color data file, pick one at random, and add it to the params
    const colors = require("./src/colors.json");
    const allColors = Object.keys(colors);
    let currentColor = allColors[(allColors.length * Math.random()) << 0];
    
    // Add the color properties to the params object
    params = {
      color: colors[currentColor],
      colorError: null,
      seo: seo
    };
  }
  
  // The Handlebars code will be able to access the parameter values and build them into the page
  reply.view("/src/pages/index.hbs", params);
});

/**
* Our POST route to handle and react to form submissions 
*
* Accepts body data indicating the user choice
*/
fastify.post("/", function(request, reply) {
  
  // Build the params object to pass to the template
  let params = { seo: seo };
  
  // If the user submitted a color through the form it'll be passed here in the request body
  let color = request.body.color;
  
  // If it's not empty, let's try to find the color
  if (color) {
    // ADD CODE FROM TODO HERE TO SAVE SUBMITTED FAVORITES
    
    // Load our color data file
    const colors = require("./src/colors.json");
    
    // Take our form submission, remove whitespace, and convert to lowercase
    color = color.toLowerCase().replace(/\s/g, "");
    
    // Now we see if that color is a key in our colors object
    if (colors[color]) {
      
      // Found one!
      params = {
        color: colors[color],
        colorError: null,
        seo: seo
      };
    } else {
      
      // No luck! Return the user value as the error property
      params = {
        colorError: request.body.color,
        seo: seo
      };
    }
  }
  
  // The Handlebars template will use the parameter values to update the page with the chosen color
  reply.view("/src/pages/index.hbs", params);
});

// Run the server and report out to the logs
fastify.listen(process.env.PORT, '0.0.0.0', function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});


const fs = require('fs')


class Contenedor {
    constructor(fileName) {
        this.fileName = fileName        
    }

    async save(object) {
        try {            
            let content = await fs.promises.readFile(this.fileName,'utf-8');                                    
            //se distingue si el archivo está vacío o contiene datos. 
            if (!content) content = [];                
            else {
                content = JSON.parse(content)                
            }            
            object.id = content.length + 1
            content.push(object)
            await fs.promises.writeFile(this.fileName, JSON.stringify(content, null, 2))
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log ('El archivo o directorio no existe')
            } else {
                console.log(err);
            }            
        }
        return object.id
    }

 
    async getById(id) {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf8');
            if (!content) console.log ('No existen datos en el archivo')
            else {            
            const contentParse = JSON.parse(content)                        
            const result = contentParse.filter(item => item.id == id)            
            return result
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log ('El archivo o directorio no existe')
            } else {
                console.log(err);
            }            
        }
    }

    async getAll() {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf8');            
            if (!content) console.log ('No existen datos en el archivo')
            else {
                const contentParse = JSON.parse(content)
                return contentParse 
            }              
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log ('El archivo o directorio no existe')
            } else {
                console.log(err);
            }            
        }
    }

    //Elimina del archivo el objeto con el id buscado
    async deleteById(id) {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf8');
            if (!content) console.log ('No existen datos en el archivo')
            else {
                const contentParse = JSON.parse(content)                
                const result = contentParse.filter((item) => item.id !== id);
                await fs.promises.writeFile(this.fileName, JSON.stringify(result, null, 2))
                console.log('Producto eliminado')                    
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log ('El archivo o directorio no existe')
            } else {
                console.log(err);
            }            
        }
    }


    async deleteAll() {
        try {
            const content = await fs.promises.readFile(this.fileName, 'utf8');
            if (!content) console.log ('No existen datos en el archivo')
            else {
            await fs.promises.writeFile(this.fileName, '')
            console.log('Los productos han sido eliminados.')
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log ('El archivo o directorio no existe')
            } else {
                console.log(err);
            }              
        }
    }     
    
}

