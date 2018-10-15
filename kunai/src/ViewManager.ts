class ViewManager extends egret.Sprite {
	public constructor() {
		super()
		this.init()
	}

	private gameStartPanel: GameStartPanel
	private gamePlayingPanel: GamePlayingPanel
	private gameEndPanel: GameEndPanel

	private init() {
		this.gameStartPanel = new GameStartPanel()
		// this.gamePlayingPanel = new GamePlayingPanel()
		// this.gameEndPanel = new GameEndPanel()
		this.start()
	}

	public start() {
		const { addChild, gameStartPanel, gamePlaying } = this
		addChild(gameStartPanel)
		gameStartPanel.addEventListener(GameStartPanel.GAME_START, gamePlaying, this)
	}

	private gamePlaying() {
		const { gameStartPanel, gamePlayingPanel, gamePlaying, gameEnd, addChild, removeChild } = this
		gameStartPanel.end()
		removeChild(gameStartPanel)
		gameStartPanel.removeEventListener(GameStartPanel.GAME_START, gamePlaying, this)
		addChild(gamePlayingPanel)
		gamePlayingPanel.addEventListener(GamePlayingPanel.CHANG_EPANEL, gameEnd, this)
	}

	private gameEnd() {
		const { gamePlayingPanel, gameEndPanel, gameEnd, gameStart, addChild, removeChild } = this
		gamePlayingPanel.end()
		removeChild(gamePlayingPanel)
		gamePlayingPanel.removeEventListener(GamePlayingPanel.CHANG_EPANEL, gameEnd, this)
		addChild(gameEndPanel)
		gameEndPanel.addEventListener(GameEndPanel.GAME_RESTART, gameStart, this)
	}

	private gameStart() {
		const { gameStartPanel, gameEndPanel, gamePlaying, gameStart, addChild, removeChild } = this
		gameEndPanel.end()
		removeChild(gameEndPanel)
		gameEndPanel.removeEventListener(GameEndPanel.GAME_RESTART, gameStart, this)
		addChild(gameStartPanel)
		gameStartPanel.addEventListener(GameStartPanel.GAME_START, gamePlaying, this)
	}
}

