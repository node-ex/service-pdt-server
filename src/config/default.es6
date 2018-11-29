const config = {}
config.port = process.env.SERVER_BACKEND_PORT || 3000
config.sourceMaps = process.env.NODE_ENV === 'development'

config.db = {}
config.db.host = process.env.DOCKER_CONTAINER_POSTGIS || 'localhost'
config.db.port = process.env.POSTGRES_PORT || 5432
config.db.user = process.env.POSTGRES_USER || 'postgres'
config.db.password = process.env.POSTGRES_PASSWORD
config.db.database = process.env.POSTGRES_DATABASE || 'postgres'

config.mapbox = {}
config.mapbox.token = process.env.MAPBOX_TOKEN

module.exports = config
