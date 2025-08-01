/* global expect */
/* eslint no-console:0 */
/* eslint-env jasmine */

import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import looksSame from 'looks-same'
import text2svg from '../dist/index.js'

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
    .sync(path.resolve(import.meta.dirname, 'testcases', '*.json'))
    .forEach(filePath => {
      const fileName = path.basename(filePath, '.json')
      console.log(fileName)

      it('matches ' + fileName, async () => {
        const config = JSON.parse(fs.readFileSync(filePath))
        const [, targetPlatform] = fileName.split('_')
        if (targetPlatform && targetPlatform !== platform) {
          return
        }

        const { equal } = await looksSame(text2svg(config[0], config[1]),
          fs.readFileSync(
            path.join(import.meta.dirname, 'expected-svg', platform, fileName + '.svg')
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
