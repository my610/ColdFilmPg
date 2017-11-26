<template>
  <div>
    <button class="btn btn-xs btn-info btn-page"
            style="margin-left: 20px;"
            @click="changePage(current)">
      <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
    </button>
    &nbsp;
    <button class="btn btn-xs btn-default btn-page"
            :disabled="!hasPrev()"
            @click="changePage(prevPage)">
      <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    </button>
    <button class="btn btn-xs btn-default btn-page" :disabled="!hasNext()" @click="changePage(nextPage)">
      <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    </button>
    &nbsp;
    <small>Page {{ currentPage }} of {{ totalPages }}  /  {{ total }}</small>
  </div>
</template>

<script>
  export default {
    props: {
      current: {
        type: Number,
        default: 1
      },
      total: {
        type: Number,
        default: 0
      },
      perPage: {
        type: Number,
        default: 9
      },
      pageRange: {
        type: Number,
        default: 2
      }
    },
    computed: {
      currentPage () {
        return (this.total === 0) ? 0 : this.current
      },
      pages: function () {
        let pages = []

        for (let i = this.rangeStart; i <= this.rangeEnd; i++) {
          pages.push(i)
        }

        return pages
      },
      rangeStart: function () {
        let start = this.current - this.pageRange

        return (start > 0) ? start : 1
      },
      rangeEnd: function () {
        let end = this.current + this.pageRange

        return (end < this.totalPages) ? end : this.totalPages
      },
      totalPages: function () {
        return Math.ceil(this.total / this.perPage)
      },
      nextPage: function () {
        return this.current + 1
      },
      prevPage: function () {
        return this.current - 1
      }
    },
    methods: {
      hasFirst: function () {
        return this.rangeStart !== 1
      },
      hasLast: function () {
        return this.rangeEnd < this.totalPages
      },
      hasPrev: function () {
        return this.current > 1
      },
      hasNext: function () {
        return this.current < this.totalPages
      },
      changePage: function (page) {
        this.$emit('page-changed', page)
      }
    }
  }
</script>
<style>
  @media (max-width: 767px) {
    /*xs*/
    .btn-page {
      /*padding: 1px 5px;*/
      /*font-size: 12px;*/
      /*line-height: 1.5;*/
      /*border-radius: 3px;*/

      padding: 6px 12px;
      font-size: 14px;
      line-height: 1.42857143;
      border-radius: 4px;
    }
  }

  /*@media (min-width: 768px) and (max-width: 991px) {*/
  /*!*sm*!*/
  /*.btn-page {*/
  /*padding: 5px 10px;*/
  /*font-size: 12px;*/
  /*line-height: 1.5;*/
  /*border-radius: 3px;*/
  /*}*/
  /*}*/
  /*@media (min-width: 992px) and (max-width: 1199px) {*/
  /*!*md*!*/
  /*.btn-page {*/
  /*padding: 6px 12px;*/
  /*font-size: 14px;*/
  /*line-height: 1.42857143;*/
  /*border-radius: 4px;*/
  /*}*/
  /*}*/
  /*@media (min-width: 1200px) {*/
  /*!*lg*!*/
  /*.btn-page {*/
  /*padding: 10px 16px;*/
  /*font-size: 18px;*/
  /*line-height: 1.3333333;*/
  /*border-radius: 6px;*/
  /*}*/
  /*}*/
</style>
