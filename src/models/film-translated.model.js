// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const filmTranslated = sequelizeClient.define('film_translated',
    {
      id: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: 'film_id'},
      status: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
      payload: {type: DataTypes.JSONB}
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'check_films',
      hooks: {
        beforeCount (options) {
          options.raw = true
        }
      }
    })

  filmTranslated.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return filmTranslated
}
