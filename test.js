// router.delete('/news/delete/:id',
//     (req, res) => {
//       // 1) remove from database
//       News
//         .findByIdAndDelete(req.params.id)
//         .then(data => {
//           const
//             arr = data.img.split('/'),
//             img_name = arr[arr.length - 1],
//             img_id = img_name.split('.')[0]


//           if (arr.some(el => el == 'res.cloudinary.com'))

//             cloudinary.uploader.destroy(img_id, {}, (err) => {
//               if (err) return res.status(500).json(err)
//               res.json(data)
//             })

//           else
//             res.json(data)

//         })
//         .catch(err =>
//           res.status(500).json(err)
//         )
//     })

//   router.post("/save_file", (req, res) => {

//     const file_name = '../../static/news/'
//     const uploadDir = path.join(__dirname, file_name)

//     const form = formidable({
//       uploadDir,
//       keepExtensions: true,
//       // filename: (name, ext) => name + ext,
//     });

//     form.parse(req, (err, fields, files) => {

//       cloudinary.uploader.upload(path.join(__dirname, file_name) + files.file.newFilename, {}, (err, result) => {
//         if (err) return res.status(402).json(err)
//         res.json({
//           file: result.url
//         // })
//       })

//     });
//   })