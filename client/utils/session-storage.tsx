/**
 * @file 封装sessionStorage
 */

const sessionStorage = global.sessionStorage;

export default {
  /**
   * 设置一个值
   * @param {string} key - 键名
   * @param {*} value - 键值
   * @returns {Promise} Promise实例
   */
  setItem(key: string, value: any) {
    return new Promise((resolve) => {
      sessionStorage.setItem(key, JSON.stringify(value));
      resolve();
    });
  },

  /**
   * 获取一个值
   * @param {string} key - 键名
   * @param {boolean} [sync] - 同步与否
   * @returns {Promise} Promise实例
   */
  getItem(key: string = '', sync: boolean = false) {
    if (sync) {
      return JSON.parse(sessionStorage.getItem(key) as string);
    }

    return new Promise((resolve) => {
      resolve(JSON.parse(sessionStorage.getItem(key) as string));
    });
  },

  /**
   * 删除一个值
   * @param {string} key - 键名
   * @returns {Promise} Promise实例
   */
  removeItem(key: string) {
    return new Promise((resolve) => {
      sessionStorage.removeItem(key);
      resolve();
    });
  },

  /**
   * 清空所有值
   * @returns {Promise} Promise实例
   */
  clear() {
    return new Promise((resolve) => {
      sessionStorage.clear();
      resolve();
    });
  },

  /**
   * 获取浏览器session占的字节大小
   * 一般浏览器的sessionStorage编码是utf-16
   * 000000 – 00FFFF 两个字节；
   * 010000 – 10FFFF 四个字节
   * @return {Object} 返回对象包含size和是否超过5m
   */
  getSize() {
    const keys = Object.keys(global.sessionStorage);
    let total = 0;
    keys.forEach((key) => {
      if (key !== 'length') {
        const str = this.getItem(key, true);
        const length = str.length;
        for (let index = 0; index < length; index++) {
          const charCode = str.charCodeAt(index);
          if (charCode <= 0xffff) {
            total += 2;
          } else {
            total += 4;
          }
        }
      }
    });
    return {
      size: total,
      overSize: total > 5 * 1024 * 1024,
    };
  },
};
