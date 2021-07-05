const { json } = require('express')
const fs = require('fs')
const data = require('../data.json')
const { date } = require('../utils')

exports.index = (req, res) => {
  return res.render('members/index', {members: data.members})
}

//show
exports.show = (req, res) => {
  const { id } = req.params

  const foundMember = data.members.find((member) => {
    return id == member.id
  })

  if (!foundMember) return res.send('Member not found')

  const member = {
    ...foundMember,
    birth: date(foundMember.birth).birthDay
  }

  return res.render('members/show', { member } )
}

//create
exports.create = (req, res) => {
    return res.render('members/create')
  }
  
//post
exports.post = (req, res) => {
  const keys = Object.keys(req.body)

  for(key of keys) {
    if (req.body[key] == "") {
      return res.send("Please, fill all fills")
    }
  }

  birth = Date.parse(req.body.birth)

  let id = 1
  const lastMember = data.members[data.members.length - 1]
  if (lastMember) {
    id = lastMember.id + 1
  }

  data.members.push({
    ...req.body,
    id, 
    birth
  })

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error!")
  
    return res.redirect("/members")
  })

}

//edit
exports.edit = (req,res) => {
  const { id } = req.params

  const foundMember = data.members.find((member) => {
    return id == member.id
  })

  if (!foundMember) return res.send('Member not found')

  const member = {
    ...foundMember,
    birth: date(foundMember.birth).iso
  }

  return res.render('members/edit', { member })
}

//update
exports.put = (req, res) => {
  const { id } = req.body
  let index = 0

  const foundMember = data.members.find((member, foundIndex) => {
    if(id == member.id) {
      index = foundIndex
      return true
    }
  })

  if (!foundMember) return res.send('Member not found')

  const member = {
    ...foundMember,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.members[index] = member

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if(err) return res.send('write error!')

    return res.redirect(`/members/${id}`)
  })
}

//delete
exports.delete = (req, res) => {
  const { id } = req.body

  const filteredMembers = data.members.filter((member) => {
    return member.id != id
  })

  data.members = filteredMembers

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if(err) return res.send('Write file error!')

    return res.redirect('/members')
  })
}