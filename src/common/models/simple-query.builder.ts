export class SimpleQueryBuilder {
  private query: string;
  private selectionAliasName: string;

  private selectPiece: string;
  private fromTablePiece: string;
  private innerJoinPieces: string[] = [];
  private wherePiece: string = '';
  private orderByPiece: string;
  private pagingPiece: string;

  select(
    selection: string | string[],
    selectionAliasName?: string,
  ): SimpleQueryBuilder {
    if (!selection || !selection.length) {
      throw new Error('You have not provide any selection!');
    }

    if (typeof selection === 'string') {
      this.selectPiece = `SELECT ${selection}`;
    } else if (Array.isArray(selection)) {
      this.selectPiece = `SELECT ${selection.join(', ')}`;
    }

    if (selectionAliasName) {
      this.selectionAliasName = selectionAliasName;
    }

    return this;
  }

  from(tableName: string): SimpleQueryBuilder {
    if (!tableName) {
      throw new Error('You have not provide any from which table to select!');
    }

    this.fromTablePiece = `FROM ${tableName}`;

    if (this.selectionAliasName) {
      this.fromTablePiece = `${this.fromTablePiece} AS ${this.selectionAliasName}`;
    }

    return this;
  }

  join(
    type: 'INNER' | 'LEFT',
    selection: string[],
    groupBy: string,
    from: string,
    selectionAliasName: string,
    joinOn: string,
  ): SimpleQueryBuilder {
    if (!selection.length || !from || !selectionAliasName || !joinOn) {
      throw new Error('You have not specified the required parameters!');
    }

    const group = groupBy ? ` GROUP BY ${groupBy}` : '';

    this.innerJoinPieces.push(`
    ${type} JOIN 
    (SELECT ${selection.join(', ')} 
    FROM ${from}${group}) AS ${selectionAliasName} 
    ON ${joinOn}`);
    return this;
  }

  where(condition: string | string[]): SimpleQueryBuilder {
    if (!condition || !condition.length) {
      return this;
      // throw new Error('You have not provide condition param!');
    }

    if (typeof condition === 'string') {
      this.wherePiece = `WHERE ${condition}`;
    } else if (Array.isArray(condition)) {
      this.wherePiece = `WHERE ${condition.join(' AND ')}`;
    }

    return this;
  }

  orderBy(order: { [key: string]: 'ASC' | 'DESC' }): SimpleQueryBuilder {
    if (!Object.keys(order).length) {
      order = { createdAt: 'DESC'};
    }

    const orders = Object.keys(order).map(key => key + ' ' + order[key]);
    this.orderByPiece = `ORDER BY ${orders.join(', ')}`;
    return this;
  }

  paging(take: number, skip?: number): SimpleQueryBuilder {
    if (!take) {
      throw new Error('You have not provide any take param!');
    }

    if (take && skip) {
      this.pagingPiece = `LIMIT ${take} OFFSET ${skip};`;
    }

    if (take && !skip) {
      this.pagingPiece = `LIMIT ${take};`;
    }

    return this;
  }

  build(): string {
    return (this.query = `${this.selectPiece} ${
      this.fromTablePiece
    } ${this.innerJoinPieces.join(' ')} ${this.wherePiece} ${
      this.orderByPiece
    } ${this.pagingPiece}`);
  }

  getSQL(): string {
    return this.query;
  }

  printQuery(): void {
    console.log(this.query);
  }
}

// const temp = new SimpleQueryBuilder();
// temp
//   .select('*', 'x')
//   .from('posts')
//   .innerJoin(
//     ['postId', 'type', 'COUNT(*) AS votes'],
//     'postId',
//     'postVotes',
//     'y',
//     'y.postId = x.id',
//   )
//   .where([
//     'type = "upvote"',
//     '(createdAt BETWEEN "2020-08-02" AND "2021-08-04")',
//   ])
//   .orderBy('votes', 'DESC')
//   .paging(10, 0)
//   .build();

//   temp.printQuery();

// temp
//   .select('COUNT(*)', 'x')
//   .build()
//   .printQuery();

// would create the following sql query
// SELECT * FROM posts as x
// INNER JOIN
// (SELECT postId, type, COUNT(*) AS votes
// FROM postVotes GROUP BY postId) AS y
// ON y.postId = x.id
// WHERE type = "upvote" AND (createdAt BETWEEN "2020-08-02" AND "2021-08-04")
// ORDER BY votes DESC
// LIMIT 10;
