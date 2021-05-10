const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Модель пользователя
const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // primaryKey: true - есть первичный ключ id, впоследвии автоматически будет инкреметироваться, создавая уникальные id
  email: { type: DataTypes.STRING, unique: true }, // должен быть уникальным, поскольку двух пользователей с одинаковым email в системе быть не может
  password: { type: DataTypes.STRING }, // пароль быть уникальным не должен, он может повторятся у разных пользователей
  role: { type: DataTypes.STRING, defaultValue: 'USER' }, // роль пользователя по умолчанию простой USER, плюс есть еще ADMIN
});

// Модель корзины
const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //
});

const BasketDevice = sequelize.define('basket_device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, //
});

const Device = sequelize.define('device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  raiting: { type: DataTypes.INTEGER, defaultValue: 0 },
  img: { type: DataTypes.STRING, allowNull: false },
});

const Type = sequelize.define('type', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Brand = sequelize.define('brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Raiting = sequelize.define('raiting', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
});

const DeviceInfo = sequelize.define('device_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  decription: { type: DataTypes.STRING, allowNull: false },
});

// Внизу id для описания промежуточной таблицы связи брендо с типами устройств, а связующие ключи sequelize создаст сам
const TypeBrand = sequelize.define('type_brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Описание того, как эти модели связаны друг с другом

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Raiting); // один пользователь может иметь несколько оценок
Raiting.belongsTo(User);

Basket.hasMany(BasketDevice); // одна корзина может иметь несколько выбранных устройств
BasketDevice.belongsTo(Basket); // каждое устройство имеет одну корзину

Type.hasMany(Device); // одному типу устройства может принадлежать несколько вариантов устройств
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(Raiting);
Raiting.belongsTo(Device);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Device.hasMany(DeviceInfo, { as: 'info' }); // связь 1 ко многим, тоесть 1 девайсу может принадлежать несколько разных описаний/характеристик
DeviceInfo.belongsTo(Device); // указали двусторонюю связь, несколько описаний могут иметь одно устройство

// При связи многое ко многим, как Type и Brand создается промежуточная таблица, которая указывает,
// какое устройство к какому бренду принадлежит и наоборот, поэтому вторым параметром передаем связующую модель объект
Type.belongsToMany(Brand, { through: TypeBrand }); // разные типы устойств могут иметь разные бренды
Brand.belongsToMany(Type, { through: TypeBrand });

module.exports = {
  User,
  Basket,
  BasketDevice,
  Device,
  Type,
  Brand,
  Raiting,
  DeviceInfo,
  TypeBrand,
};
