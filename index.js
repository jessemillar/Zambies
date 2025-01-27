ejecta.include('lorina.min.js')

ejecta.include('listeners.js')
ejecta.include('functions.js')

ejecta.include('screens/loading.js')
ejecta.include('screens/menu.js')
ejecta.include('screens/credits.js')
ejecta.include('screens/settings.js')
ejecta.include('screens/game.js')
ejecta.include('screens/paused.js')
ejecta.include('screens/gameover.js')

l.ad.banner.show('top') // Show an ad on the menu

l.gamecenter.login.soft() // Log in to Game Center if we have a valid login from last time

// Game colors
var colorBlack = '#111111'
var colorRed = '#FF4136'
var colorYellow = '#FFDC00'
var colorGreen = '#3D9970'
var colorWhite = '#FFFFFF'

l.game.setup(colorBlack)
l.tilt.enable()
l.touch.enable()

l.debug.all = false
l.debug.gamecenter = false

l.canvas.width = l.canvas.width * 1.75
l.canvas.height = l.canvas.width // Make the playing field square

l.physics.friction(1)

var spawned = false // Track whether zombies have spawned or not

var maxTilt = 24 // The maximum tilt angle allowed (this number of degrees is the same as "flooring it")

// Font stuff
var fontFamily = 'MinercraftoryRegular'
var fontSize = 20
var titleSize = 70
var achievementSize = 35
var totalSize = 35
var textPadding = 5

var topLine = l.entities.camera.height / 2 - achievementSize * 2 - fontSize
var middleLine = l.entities.camera.height / 2 - fontSize
var bottomLine = l.entities.camera.height / 2 + achievementSize * 2 - fontSize + textPadding

var loadingTextState = 0 // Allow the loading text to have a "pulsing" ellipses

var safeZone = l.canvas.width * 0.2 // Make sure this is less than zombieVision
var playerSpeed = 7
var playerCanMove = true
var freezeTime = 1500

var startBulletForce = l.canvas.width / 3
var bulletForce = startBulletForce
var bulletLife = 1000

var gibletForce = l.canvas.width / 6
var gibletLife = 2000
var gibletCount = 6

var canShoot = true
var timeShoot = 500
var spawnForce = playerSpeed * 25

var enemyCount = Math.round(l.canvas.width / 18)

var zombieSpeed = playerSpeed * 0.35
var zombieVision = l.canvas.width * 0.2
var boggartSpeed = playerSpeed * 0.55
var boggartVision = l.canvas.width * 0.65
var ghostSpeed = playerSpeed * 0.35
var ghostVision = l.canvas.width * 0.4
var wraithSpeed = playerSpeed * 0.35
var wraithVision = l.canvas.width * 0.05

// Score and Game Center stuff
var reported = false
var accuracy = 0
var shotsFired = 0
var seconds = 0
var killed = 0
var score = 0
var newHighscore = false

if (localStorage.getItem('highscore'))
{
	var highscore = localStorage.getItem('highscore')
}
else
{
	var highscore = 0
}

var achievementValues = [200, 400, 600, 800, 1000, 3000, 5000, 7000, 9000, 11000, 13000, 15000]
var achievementTitles = ['a n00b', 'bazookasaur', 'a space man', 'a krazy d00d', 'THE d00d', 'a hunter', 'the one', 'beautiful', 'teh best', 'a w!nner', 'the special', 'the doge']

ejecta.include('objects.js')

l.audio.loop('song')
l.game.start('menu')