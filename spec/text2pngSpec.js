/* global expect */
/* eslint no-console:0 */
/* eslint-env jasmine */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

const text2svg = require('../index.js')
const looksSame = require('looks-same')

const platform = {
  darwin: 'osx',
  linux: 'linux',

  // The following are not tested
  win32: 'windows',
  aix: 'linux',
  freebsd: 'linux',
  openbsd: 'linux',
  sunos: 'linux'
}[process.platform]

describe('text2svg', () => {
  glob
    .sync(path.resolve(__dirname, 'testcases', '*.json'))
    .forEach(filePath => {
      const fileName = path.basename(filePath, '.json')
      console.log(fileName)

      it('matches ' + fileName, async () => {
        const config = JSON.parse(fs.readFileSync(filePath))
        const [, targetPlatform] = fileName.split('_')
        if (targetPlatform && targetPlatform !== platform) {
          return
        }

        fs.writeFileSync(
          path.join(__dirname, 'expected-svg', platform, fileName + '.svg'),
          text2svg.apply(text2svg, config)
        )

        const { equal } = await looksSame(text2svg.apply(text2svg, config),
          fs.readFileSync(
            path.join(__dirname, 'expected-svg', platform, fileName + '.svg')
          ),
          {
            tolerance: 0.2,
            ignoreAntialiasing: true,
            antialiasingTolerance: 3
          })
        expect(equal).toBe(true)
      })
    })
})
