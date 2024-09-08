var select = require('./xpath.js')
var dom = require('xmldom').DOMParser
var xml = '<book><title>Harry Potter</title></book>'
var doc = new dom().parseFromString(xml)
var nodes = select(doc, '//title')
console.log(nodes[0].localName + ': ' + nodes[0].firstChild.data)
console.log('node: ' + nodes[0].toString())
