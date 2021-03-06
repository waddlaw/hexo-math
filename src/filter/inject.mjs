import { MATH_MARKER, INLINE_MATH_REGEX, BLOCK_MATH_REGEX, KATEX_BLOCK_MARKER, KATEX_INLINE_MARKER } from "../consts";

export default class Inject {
  constructor(hexo, opts) {
    this.hexo = hexo;
    this.opts = opts;
  }
  register() {
    const { filter } = this.hexo.extend;
    const injectors = {
      mathjax: this._injectMathJax.bind(this),
      katex: this._injectKaTeX.bind(this)
    }
    filter.register("inject_ready", injectors[this.opts.engine])
  }
  _injectMathJax(inject) {
    const data = this.opts.mathjax
    const opts = {
      data,
      inline: true,
      shouldInject: (src) => src.indexOf(MATH_MARKER) >= 0 || INLINE_MATH_REGEX.test(src) || BLOCK_MATH_REGEX.test(src)
    }
    inject.bodyEnd.require('../../asset/inject.swig', opts)
  }
  _injectKaTeX(inject) {
    const { css } = this.opts.katex

    const opts = {
      shouldInject: (src) => src.indexOf(KATEX_INLINE_MARKER) >= 0 || src.indexOf(KATEX_BLOCK_MARKER) >= 0
    }

    inject.headEnd.link({ rel: 'stylesheet', href: css }, opts)
  }
}
