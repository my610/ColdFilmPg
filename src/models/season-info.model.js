// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const seasonInfo = sequelizeClient.define('season_info',
    {
      id: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
      group_id: {type: DataTypes.INTEGER, defaultValue: 0},
      status: {type: DataTypes.INTEGER, defaultValue: 1},
      season: {type: DataTypes.INTEGER, defaultValue: 0},
      last_series: {type: DataTypes.INTEGER, defaultValue: 0},
      series_count: {type: DataTypes.INTEGER, defaultValue: 255},
      toramp_id: {type: DataTypes.INTEGER, defaultValue: 0},
      title: {type: DataTypes.TEXT, allowNull: false},
      img: {type: DataTypes.TEXT}
    },
    {
      indexes: [
        {name: 'seasons_id_uindex', unique: true, fields: ['id']},
        {name: 'seasons_status_index', fields: ['status']}
      ],
      freezeTableName: true,
      // don't add the timestamp attributes (updatedAt, createdAt)
      timestamps: false,
      collate: 'utf8_general_ci',
      // define the table's name
      tableName: 'seasons',
      hooks: {
        beforeCount (options) {
          options.raw = true
        }
      }
    })

  seasonInfo.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return seasonInfo
}
