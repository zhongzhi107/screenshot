/**
1. 字体、字号、颜色
2. 合成
3. 创建
4. 高斯模糊
5. resize
*/
const path = require('path');
const gm = require('gm');
const config = require('./config');
// const gm = require('gm').subClass({ imageMagick: true });

const absPath = file => path.resolve(__dirname, '..', file)
const randomName = () => {
  const name = Date.now().toString() + parseInt(Math.random() * 10000, 10)
  return absPath(`.tmp/${name}.png`)
}

const write = (gm, file) => new Promise((resolve, reject) => {
  gm.write(file, (error) => {
    if (error) {
      reject(error)
    } else {
      resolve(file)
    }
  })
});

const run = (config) => {
  const { fontColor, fontName, titleFontSize, subTitleFontSize, titleY } = config.locals.en;

  const width = 1242;
  const height = 2688;
  const frame = '6.5-white.png';
  const font = `/System/Library/Fonts/${fontName}`;

  config.locals.en.images.forEach(async ({ title, subTitle }, index) => {
    const titleX = (width - title.length * titleFontSize)/2;
    const subTitleX = (width - subTitle.length * subTitleFontSize)/2;
    const subTitleY = titleY + subTitleFontSize * 2; // 行高 200%
    const tmpScreenshot = randomName()
    const tmpBackground1 = randomName()
    const tmpBackground2 = randomName()
    await write(gm(absPath(`images/screenshot/en/6.5/0${index}.png`))
      .resize(982), tmpScreenshot);

    await write(gm(absPath('images/background/001.png'))
      .resize(width, height, '!')
      .fill(fontColor)
      .font(font)
      .fontSize(titleFontSize)
      .drawText(titleX, titleY, title)
      .fontSize(subTitleFontSize)
      .drawText(subTitleX, subTitleY, subTitle), tmpBackground1);

    await write(gm(tmpBackground1)
      .composite(tmpScreenshot)
      .geometry('+130+660'), tmpBackground2);

    await write(gm(tmpBackground2)
      .composite(absPath(`images/frame/${frame}`)), absPath(`output/en-${index}.png`));
  });

}

run(config);

// gm(absPath('images/screenshot/en/6.5/01.png'))
//   .resize(982)
//   .write(absPath('.tmp/1.png'), (error) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('1...ok');
//     }
//   });
//
// // gm(400, 400, '#ffff00f3')
// gm(absPath('images/background/001.png'))
//   // 画圈
//   // .stroke('#ff0000')
//   // .drawCircle(10, 10, 20, 10)
//   // 写字
//   // .font('/System/Library/Fonts/Helvetica.ttc', 50)
//   // .fill('#ff0000')
//   // .drawText(50, 50, 'Hello world')
//   // .blur(70, 3)
//   .resize(1242, 2688, '!')
//   // 合并
//   // .composite(absPath('images/screenshot/en/6.5/01.png'))
//   // .geometry('+130+343')
//   .composite(absPath('.tmp/1.png'))
//   .geometry('+130+660')
//   //.geometry('+0+0')
//   .write(absPath('.tmp/2.png'), function (error) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('2...ok');
//     }
//   });
//
// gm(absPath('.tmp/2.png'))
//   .composite(absPath('images/frame/6.5-white.png'))
//   .write(absPath('.tmp/3.png'), function (error) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('3...ok');
//     }
//   });
