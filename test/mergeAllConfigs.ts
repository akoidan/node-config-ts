import * as assert from 'assert'
import * as path from 'path'
import {mergeAllConfigs} from '../src/mergeAllConfigs'

describe('mergeAllConfigs()', () => {
  it('should load configs from all the places', () => {
    const process = {
      argv: [],
      cwd: () => path.resolve(__dirname, 'stub-module'),
      env: {
        DEPLOYMENT: 'www.example.com',
        NODE_ENV: 'production',
        USER: 'root',
        MAX_RETRIES: 999
      }
    }
    const actual = mergeAllConfigs(process)
    const expected = {
      type: 'user',
      port: 9000,
      maxRetries: 999
    }
    assert.deepEqual(actual, expected)
  })
  it('should override with cli configs', () => {
    const process = {
      argv: ['--port', '3000', '--wonder', 'woman'],
      cwd: () => path.resolve(__dirname, 'stub-module'),
      env: {
        DEPLOYMENT: 'www.example.com',
        NODE_ENV: 'production',
        USER: 'root',
        MAX_RETRIES: 999
      }
    }
    const actual = mergeAllConfigs(process)
    const expected = {
      type: 'user',
      port: 3000,
      wonder: 'woman',
      maxRetries: 999
    }
    assert.deepEqual(actual, expected)
  })
  it('should override ENV variables with cli configs', () => {
    const process = {
      argv: ['--port', '3000', '--maxRetries', '150'],
      cwd: () => path.resolve(__dirname, 'stub-module'),
      env: {
        DEPLOYMENT: 'www.example.com',
        NODE_ENV: 'production',
        USER: 'root',
        MAX_RETRIES: 999
      }
    }
    const actual = mergeAllConfigs(process)
    const expected = {
      type: 'user',
      port: 3000,
      maxRetries: 150
    }
    assert.deepEqual(actual, expected)
  })

  describe('alternative env varialble', () => {
    it('should load configs from all the places', () => {
      const process = {
        argv: [],
        cwd: () => path.resolve(__dirname, 'stub-module'),
        env: {
          DEPLOYMENT: 'www.example.com',
          NODE_CONFIG_TS_ENV: 'production',
          USER: 'root',
          MAX_RETRIES: 999
        }
      }
      const actual = mergeAllConfigs(process)
      const expected = {
        type: 'user',
        port: 9000,
        maxRetries: 999
      }
      assert.deepEqual(actual, expected)
    })
    it('should override with cli configs', () => {
      const process = {
        argv: ['--port', '3000', '--wonder', 'woman'],
        cwd: () => path.resolve(__dirname, 'stub-module'),
        env: {
          DEPLOYMENT: 'www.example.com',
          NODE_CONFIG_TS_ENV: 'production',
          USER: 'root',
          MAX_RETRIES: 999
        }
      }
      const actual = mergeAllConfigs(process)
      const expected = {
        type: 'user',
        port: 3000,
        wonder: 'woman',
        maxRetries: 999
      }
      assert.deepEqual(actual, expected)
    })
    it('should override ENV variables with cli configs', () => {
      const process = {
        argv: ['--port', '3000', '--maxRetries', '150'],
        cwd: () => path.resolve(__dirname, 'stub-module'),
        env: {
          DEPLOYMENT: 'www.example.com',
          NODE_CONFIG_TS_ENV: 'production',
          USER: 'root',
          MAX_RETRIES: 999
        }
      }
      const actual = mergeAllConfigs(process)
      const expected = {
        type: 'user',
        port: 3000,
        maxRetries: 150
      }
      assert.deepEqual(actual, expected)
    })

    it('should not throw exception if @@ENV is in default.json but string in other', () => {
      const process = {
        argv: [],
        cwd: () => path.resolve(__dirname, 'stub-module'),
        env: {
          NODE_CONFIG_TS_ENV: 'redefinedenv'
        }
      }
      const actual = mergeAllConfigs(process)
      const expected = {
        maxRetries: 3,
        port: 9000,
        type: 'default'
      }
      assert.deepEqual(actual, expected)
    })
    it('should throw exception string is rewritten as @@ENV in config', () => {
      const process = {
        argv: [],
        cwd: () => path.resolve(__dirname, 'stub-module'),
        env: {
          NODE_CONFIG_TS_ENV: 'rewritten'
        }
      }
      assert.throws(() => mergeAllConfigs(process), {
        message: 'Environment variable "PORT" is not set'
      })
    })
    it('should clear "\\n" from env variables', () => {
      const process = {
        argv: [],
        cwd: () => path.resolve(__dirname, 'stub-module'),
        env: {
          MAX_RETRIES: 'with_new_line\n'
        }
      }
      const actual = mergeAllConfigs(process)
      const expected = {
        maxRetries: 'with_new_line',
        port: 9000,
        type: 'default'
      }
      assert.deepEqual(actual, expected)
    })
  })
})
