const { response, request } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query).skip(Number(desde)).limit(Number(limite)),
    //Como traigo los datos de los usuarios y las categorias?🤔
  ]);

  res.json({
    total,
    productos,
  });
};

const obtenerProducto = async (req = request, res = response) => {
  const id = req.params.id;

  const producto = await Producto.findById(id);
  //Como traigo los datos de los usuarios y las categorias?🤔

  res.json({
    producto,
  });
};

//Crear Producto--------------------------------------
const crearProducto = async (req, res = response) => {
  const { nombre, precio, categoria, descripcion } = req.body;

  const productoDB = await Producto.findOne({ nombre });

  if (productoDB) {
    res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe`,
    });
  }
  //Generar la data a guardar

  const data = {
    nombre,
    categoria,
    precio,
    descripcion,
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  //grabar en la base de datos
  await producto.save();

  res.status(201).json(producto);
};

//actualizarProducto (validar nombre)-----------------------------------------

const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria, descripcion, disponible } = req.body;
  const usuario = req.usuario._id;
  const data = {
    nombre,
    precio,
    descripcion,
    categoria,
    disponible,
    usuario,
  };

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.status(201).json(producto);
};

//Borrar producto-----------------------------------------------------
const borrarProducto = async (req, res) => {
  const { id } = req.params;

  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    productoBorrado,
  });
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};
