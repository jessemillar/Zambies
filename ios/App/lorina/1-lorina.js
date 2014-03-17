var l = new Object() // The Lorina object that keeps the engine functions out of the way

l.game = new Object() // Group the game functions
l.debug = new Object() // Keep track of the various debug options

l.game.setup = function(gameColor, fullscreen)
{
    if (fullscreen)
    {
        document.body.style.background = gameColor
    }
    l.dom = document.getElementById('canvas')
    l.ctx = document.getElementById('canvas').getContext('2d')
	
    l.canvas = new Object() // Used to reference the height and width of the canvas later on without breaking other functions
	l.canvas.width = l.dom.width
	l.canvas.height = l.dom.height
	
    if (!window.navigator.vendor)
    {
        l.canvas.agent = 'ejecta'
    }
    else if (window.navigator.vendor == 'Google Inc.')
    {
        l.canvas.agent = 'chrome'
    }
	
    if (fullscreen)
    {
        l.game.fullscreen()
        if (l.canvas.agent == 'chrome')
        {
            document.body.setAttribute('onresize', 'l.game.fullscreen()') // Add a listener that will always keep the canvas fullscreen
        }
    }
	
    l.object.make('camera', 0, 0, l.canvas.width, l.canvas.height)
    l.entities.camera.color = gameColor
    l.entities.camera.previous = new Object() // Keep track of the camera's previous position for use with the shaking function
	l.entities.camera.previous.x = l.entities.camera.x
	l.entities.camera.previous.y = l.entities.camera.y
}

l.game.fullscreen = function()
{
    l.dom.style.position = 'absolute'
    l.dom.style.left = '0px'
    l.dom.style.top = '0px'
    l.dom.width = window.innerWidth
    l.dom.height = window.innerHeight
    if (l.canvas)
    {
        l.canvas.width = l.dom.width
        l.canvas.height = l.dom.height
    }
    if (l.entities.camera)
    {
        l.entities.camera.width = l.dom.width
        l.entities.camera.height = l.dom.height
    }
}

l.game.start = function()
{
    l.game.loop = setInterval(l.game.loading, 1000 / 60)
}

l.game.stop = function() // Only works once the game is running; no effect during loading or setup
{
    clearInterval(l.game.loop)
}

l.screen = new Object() // Group the screen functions and values
l.screen.change = new Object() // Group the screen change functions

l.screen.change.loading = function()
{
	clearInterval(l.game.loop)
	l.game.state = 'loading'
	l.game.loop = setInterval(l.screen.loading, 1000 / 60)
}

l.screen.change.menu = function()
{
	clearInterval(l.game.loop)
	l.game.state = 'menu'
	l.game.loop = setInterval(l.screen.menu, 1000 / 60)
}

l.screen.change.settings = function()
{
    clearInterval(l.game.loop)
    l.game.state = 'settings'
    l.game.loop = setInterval(l.screen.settings, 1000 / 60)
}

l.screen.change.credits = function()
{
    clearInterval(l.game.loop)
    l.game.state = 'credits'
    l.game.loop = setInterval(l.screen.credits, 1000 / 60)
}

l.screen.change.game = function()
{
	clearInterval(l.game.loop)
	l.game.state = 'game'
	l.game.loop = setInterval(l.screen.game, 1000 / 60)
}

l.screen.change.gameover = function()
{
	clearInterval(l.game.loop)
	l.game.state = 'gameover'
	l.game.loop = setInterval(l.screen.gameover, 1000 / 60)
}

l.screen.change.paused = function()
{
	clearInterval(l.game.loop)
	l.game.state = 'paused'
	l.game.loop = setInterval(l.screen.paused, 1000 / 60)
}

l.camera = new Object() // Group the camera functions

l.camera.follow = function(name, sandboxWidth, sandboxHeight)
{
    if (!l.entities.camera.shaking)
    {
        l.entities.camera.following = true // Tell the world that we're following something with the camera
		
        if (sandboxWidth)
        {
            if (l.entities[name].anchor.x < l.entities.camera.x + l.entities.camera.width / 2 - sandboxWidth / 2)
            {
                l.entities.camera.x = Math.round(l.entities[name].anchor.x - l.entities.camera.width / 2 + sandboxWidth / 2)
            }
            else if (l.entities[name].anchor.x > l.entities.camera.x + l.entities.camera.width / 2 + sandboxWidth / 2)
            {
                l.entities.camera.x = Math.round(l.entities[name].anchor.x - l.entities.camera.width / 2 - sandboxWidth / 2)
            }
        }
		
        if (sandboxHeight)
        {
            if (l.entities[name].anchor.y < l.entities.camera.y + l.entities.camera.height / 2 - sandboxHeight / 2)
            {
                l.entities.camera.y = Math.round(l.entities[name].anchor.y - l.entities.camera.height / 2 + sandboxHeight / 2)
            }
            else if (l.entities[name].anchor.y > l.entities.camera.y + l.entities.camera.height / 2 + sandboxHeight / 2)
            {
                l.entities.camera.y = Math.round(l.entities[name].anchor.y - l.entities.camera.height / 2 - sandboxHeight / 2)
            }
        }
		
        if (l.entities.camera.x < 0)
        {
            l.entities.camera.x = 0
        }
        else if (l.entities.camera.x > l.canvas.width - l.entities.camera.width)
        {
            l.entities.camera.x = l.canvas.width - l.entities.camera.width
        }
		
        if (l.entities.camera.y < 0)
        {
            l.entities.camera.y = 0
        }
        else if (l.entities.camera.y > l.canvas.height - l.entities.camera.height)
        {
            l.entities.camera.y = l.canvas.height - l.entities.camera.height
        }
    }
}

l.camera.reset = function()
{
    l.entities.camera.x = 0
    l.entities.camera.y = 0
}

l.camera.shake = function(shakes, duration, severity)
{
    if (l.entities.camera.following)
    {
        l.entities.camera.shaking = true // Tell the "following" function that we're shaking
    }
	
    // "Back up" the camera's position
    l.entities.camera.previous.x = l.entities.camera.x
    l.entities.camera.previous.y = l.entities.camera.y
	
    var timing = duration / (shakes * 2)
	
    for (var i = 0; i < shakes * 2; i++)
    {
        if (i % 2 == 0)
        {
            setTimeout(function() // Set the timeout that will reset the camera back to its proper position
					   {
					   l.entities.camera.x = l.entities.camera.previous.x
					   l.entities.camera.y = l.entities.camera.previous.y
					   }, timing * i)
        }
        else
        {
            setTimeout(function()
					   {
					   var xMovement = Math.round(l.tools.random(0 - severity / 2, severity / 2))
					   var yMovement = Math.round(l.tools.random(0 - severity / 2, severity / 2))
					   
					   if (xMovement > 0)
					   {
					   if (l.entities.camera.x + xMovement < l.canvas.width - l.entities.camera.width)
					   {
					   l.entities.camera.x += xMovement
					   }
					   }
					   else
					   {
					   if (l.entities.camera.x - Math.abs(xMovement) > 0)
					   {
					   l.entities.camera.x = l.entities.camera.x - Math.abs(xMovement)
					   }
					   }
					   
					   if (yMovement > 0)
					   {
					   if (l.entities.camera.y + yMovement < l.canvas.height - l.entities.camera.height)
					   {
					   l.entities.camera.y += yMovement
					   }
					   }
					   else
					   {
					   if (l.entities.camera.y - Math.abs(yMovement) > 0)
					   {
					   l.entities.camera.y -= Math.abs(yMovement)
					   }
					   }
					   }, timing * i)
        }
    }
	
    setTimeout(function()
			   {
			   if (l.entities.camera.following)
			   {
			   l.entities.camera.shaking = false // Tell the following function that we're done shaking
			   }
			   }, duration)
}