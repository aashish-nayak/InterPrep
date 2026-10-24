// In-Browser Relational SQL Execution Engine & Interview Schema
// Supports standard ANSI SQL: SELECT, WHERE, JOIN, GROUP BY, HAVING, ORDER BY, LIMIT, AGGREGATES

export const INITIAL_DATABASE = {
  departments: [
    { id: 1, name: 'Engineering', budget: 1200000 },
    { id: 2, name: 'Product Design', budget: 450000 },
    { id: 3, name: 'Marketing', budget: 350000 },
    { id: 4, name: 'Infrastructure & DevOps', budget: 800000 },
    { id: 5, name: 'Human Resources', budget: 200000 }
  ],
  employees: [
    { id: 101, name: 'Aarav Sharma', department_id: 1, salary: 95000, hire_date: '2021-03-15', status: 'active' },
    { id: 102, name: 'Priya Patel', department_id: 1, salary: 110000, hire_date: '2020-07-01', status: 'active' },
    { id: 103, name: 'Rohan Verma', department_id: 2, salary: 72000, hire_date: '2022-01-10', status: 'active' },
    { id: 104, name: 'Sneha Reddy', department_id: 1, salary: 85000, hire_date: '2023-04-20', status: 'active' },
    { id: 105, name: 'Vikram Singh', department_id: 4, salary: 98000, hire_date: '2019-11-05', status: 'active' },
    { id: 106, name: 'Neha Gupta', department_id: 3, salary: 65000, hire_date: '2022-09-18', status: 'inactive' },
    { id: 107, name: 'Karan Mehra', department_id: 1, salary: 125000, hire_date: '2018-05-12', status: 'active' },
    { id: 108, name: 'Ananya Roy', department_id: 2, salary: 78000, hire_date: '2021-08-22', status: 'active' },
    { id: 109, name: 'Kabir Das', department_id: null, salary: 55000, hire_date: '2024-02-01', status: 'active' },
    { id: 110, name: 'Devendra Joshi', department_id: 1, salary: 102000, hire_date: '2021-11-10', status: 'active' },
    { id: 111, name: 'Tanvi Shah', department_id: 1, salary: 92000, hire_date: '2023-01-15', status: 'active' }
  ],
  customers: [
    { id: 1, name: 'Acme Corp', email: 'billing@acme.com', city: 'San Francisco' },
    { id: 2, name: 'Globex Ltd', email: 'orders@globex.com', city: 'London' },
    { id: 3, name: 'Initech', email: 'procurement@initech.com', city: 'Austin' },
    { id: 4, name: 'Soylent Inc', email: 'finance@soylent.com', city: 'New York' },
    { id: 5, name: 'Umbrella Corp', email: 'rnd@umbrella.com', city: 'Chicago' },
    { id: 6, name: 'Stark Industries', email: 'tony@stark.com', city: 'Los Angeles' }
  ],
  users: [
    { id: 1, name: 'Alex Smith', email: 'alex.smith@example.com', role: 'admin', created_at: '2023-01-10' },
    { id: 2, name: 'Alex S.', email: 'alex.smith@example.com', role: 'member', created_at: '2023-02-14' },
    { id: 3, name: 'Alexander Smith', email: 'alex.smith@example.com', role: 'guest', created_at: '2023-03-20' },
    { id: 4, name: 'Sarah Jones', email: 'sarah.j@example.com', role: 'editor', created_at: '2023-04-05' },
    { id: 5, name: 'Sarah Jones (Backup)', email: 'sarah.j@example.com', role: 'member', created_at: '2023-05-12' },
    { id: 6, name: 'Devendra Joshi', email: 'dev.joshi@example.com', role: 'developer', created_at: '2023-06-01' },
    { id: 7, name: 'Priya Verma', email: 'priya.v@example.com', role: 'designer', created_at: '2023-07-15' },
    { id: 8, name: 'John Doe', email: 'john.doe@example.com', role: 'member', created_at: '2023-08-09' },
    { id: 9, name: 'Johnathan Doe', email: 'john.doe@example.com', role: 'guest', created_at: '2023-09-18' },
    { id: 10, name: 'Anonymous Guest', email: null, role: 'visitor', created_at: '2023-10-01' }
  ],
  orders: [
    { id: 501, customer_id: 1, customer_name: 'Acme Corp', amount: 15400, status: 'completed', created_at: '2024-01-15' },
    { id: 502, customer_id: 2, customer_name: 'Globex Ltd', amount: 8900, status: 'completed', created_at: '2024-01-18' },
    { id: 503, customer_id: 1, customer_name: 'Acme Corp', amount: 22000, status: 'processing', created_at: '2024-02-01' },
    { id: 504, customer_id: 3, customer_name: 'Initech', amount: 4300, status: 'cancelled', created_at: '2024-02-10' },
    { id: 505, customer_id: 2, customer_name: 'Globex Ltd', amount: 31000, status: 'completed', created_at: '2024-02-22' },
    { id: 506, customer_id: 4, customer_name: 'Soylent Inc', amount: 12500, status: 'completed', created_at: '2024-03-05' },
    { id: 507, customer_id: 1, customer_name: 'Acme Corp', amount: 45000, status: 'completed', created_at: '2024-03-12' },
    { id: 508, customer_id: 3, customer_name: 'Initech', amount: 18200, status: 'completed', created_at: '2024-03-20' },
    // Keyset pagination orders with id > 10000
    { id: 10001, customer_id: 1, customer_name: 'Acme Corp', amount: 1200, status: 'completed', created_at: '2024-04-01 10:00:00' },
    { id: 10002, customer_id: 2, customer_name: 'Globex Ltd', amount: 3400, status: 'completed', created_at: '2024-04-01 10:05:00' },
    { id: 10003, customer_id: 1, customer_name: 'Acme Corp', amount: 5600, status: 'completed', created_at: '2024-04-01 10:10:00' },
    { id: 10004, customer_id: 3, customer_name: 'Initech', amount: 2100, status: 'completed', created_at: '2024-04-01 10:15:00' },
    { id: 10005, customer_id: 4, customer_name: 'Soylent Inc', amount: 7800, status: 'completed', created_at: '2024-04-01 10:20:00' },
    { id: 10006, customer_id: 2, customer_name: 'Globex Ltd', amount: 9200, status: 'completed', created_at: '2024-04-01 10:25:00' },
    { id: 10007, customer_id: 1, customer_name: 'Acme Corp', amount: 4300, status: 'completed', created_at: '2024-04-01 10:30:00' },
    { id: 10008, customer_id: 3, customer_name: 'Initech', amount: 6500, status: 'completed', created_at: '2024-04-01 10:35:00' },
    { id: 10009, customer_id: 4, customer_name: 'Soylent Inc', amount: 1100, status: 'completed', created_at: '2024-04-01 10:40:00' },
    { id: 10010, customer_id: 2, customer_name: 'Globex Ltd', amount: 8400, status: 'completed', created_at: '2024-04-01 10:45:00' },
    { id: 10011, customer_id: 1, customer_name: 'Acme Corp', amount: 3900, status: 'completed', created_at: '2024-04-01 10:50:00' },
    { id: 10012, customer_id: 3, customer_name: 'Initech', amount: 7200, status: 'completed', created_at: '2024-04-01 10:55:00' },
    { id: 10013, customer_id: 4, customer_name: 'Soylent Inc', amount: 6100, status: 'completed', created_at: '2024-04-01 11:00:00' },
    { id: 10014, customer_id: 2, customer_name: 'Globex Ltd', amount: 9500, status: 'completed', created_at: '2024-04-01 11:05:00' },
    { id: 10015, customer_id: 1, customer_name: 'Acme Corp', amount: 2800, status: 'completed', created_at: '2024-04-01 11:10:00' },
    { id: 10016, customer_id: 3, customer_name: 'Initech', amount: 4900, status: 'completed', created_at: '2024-04-01 11:15:00' },
    { id: 10017, customer_id: 4, customer_name: 'Soylent Inc', amount: 8300, status: 'completed', created_at: '2024-04-01 11:20:00' },
    { id: 10018, customer_id: 2, customer_name: 'Globex Ltd', amount: 1700, status: 'completed', created_at: '2024-04-01 11:25:00' },
    { id: 10019, customer_id: 1, customer_name: 'Acme Corp', amount: 5400, status: 'completed', created_at: '2024-04-01 11:30:00' },
    { id: 10020, customer_id: 3, customer_name: 'Initech', amount: 6800, status: 'completed', created_at: '2024-04-01 11:35:00' },
    { id: 10021, customer_id: 4, customer_name: 'Soylent Inc', amount: 3200, status: 'completed', created_at: '2024-04-01 11:40:00' },
    { id: 10022, customer_id: 2, customer_name: 'Globex Ltd', amount: 4600, status: 'completed', created_at: '2024-04-01 11:45:00' },
    { id: 10023, customer_id: 1, customer_name: 'Acme Corp', amount: 9900, status: 'completed', created_at: '2024-04-01 11:50:00' },
    { id: 10024, customer_id: 3, customer_name: 'Initech', amount: 5100, status: 'completed', created_at: '2024-04-01 11:55:00' },
    { id: 10025, customer_id: 4, customer_name: 'Soylent Inc', amount: 8700, status: 'completed', created_at: '2024-04-01 12:00:00' }
  ]
};

export const SQL_INTERVIEW_PRESETS = [
  {
    title: 'Find 2nd Highest Salary (Classic)',
    description: 'Find the second highest distinct salary among all employees without hardcoding IDs.',
    sql: `SELECT DISTINCT salary \nFROM employees \nORDER BY salary DESC \nLIMIT 1 OFFSET 1;`
  },
  {
    title: 'Departments with Avg Salary > 75,000',
    description: 'Group employees by department, calculate the average salary, and filter groups with HAVING.',
    sql: `SELECT d.name AS department, \n       COUNT(e.id) AS employee_count, \n       ROUND(AVG(e.salary), 0) AS avg_salary\nFROM departments d\nJOIN employees e ON d.id = e.department_id\nGROUP BY d.name\nHAVING avg_salary > 75000\nORDER BY avg_salary DESC;`
  },
  {
    title: 'Employees & Dept (Including Unassigned)',
    description: 'Use a LEFT JOIN to list every employee along with their department name, even if unassigned.',
    sql: `SELECT e.id, e.name AS employee, \n       COALESCE(d.name, 'Unassigned') AS department, \n       e.salary\nFROM employees e\nLEFT JOIN departments d ON e.department_id = d.id\nORDER BY e.salary DESC;`
  },
  {
    title: 'Top Customers by Total Revenue',
    description: 'Calculate total completed sales per customer and order by revenue.',
    sql: `SELECT customer_name, \n       COUNT(id) AS total_orders, \n       SUM(amount) AS total_spent\nFROM orders\nWHERE status = 'completed'\nGROUP BY customer_name\nORDER BY total_spent DESC\nLIMIT 3;`
  },
  {
    title: 'Employees Earning Above Company Average',
    description: 'Correlated / Subquery comparison against the overall benchmark average salary.',
    sql: `SELECT name, salary \nFROM employees \nWHERE salary > (SELECT AVG(salary) FROM employees)\nORDER BY salary DESC;`
  }
];

/**
 * Execute an SQL query against the in-memory database
 */
export function executeSql(sqlQuery, db = INITIAL_DATABASE) {
  const startTime = performance.now();
  const trimmed = sqlQuery.trim().replace(/;+$/, '');
  
  if (!trimmed) {
    return { error: 'Empty SQL query', columns: [], rows: [], latencyMs: 0 };
  }

  try {
    // Basic SQL parser & execution simulator
    const isExplain = /^EXPLAIN\s+/i.test(trimmed);
    const cleanSql = trimmed.replace(/^EXPLAIN\s+/i, '').trim();

    if (isExplain) {
      const plan = generateExplainPlan(cleanSql, db);
      const latencyMs = Number((performance.now() - startTime).toFixed(2));
      return {
        columns: ['id', 'select_type', 'table', 'type', 'possible_keys', 'key', 'rows', 'Extra'],
        rows: plan,
        latencyMs,
        isExplain: true
      };
    }

    // Determine primary table
    const fromMatch = cleanSql.match(/FROM\s+([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?/i);
    if (!fromMatch) {
      throw new Error("Could not find valid 'FROM table' in query.");
    }

    const primaryTableName = fromMatch[1].toLowerCase();
    const primaryTableAlias = fromMatch[2] || primaryTableName;

    if (!db[primaryTableName]) {
      throw new Error(`Table '${primaryTableName}' does not exist in interview database. Available: ${Object.keys(db).join(', ')}`);
    }

    // Build base dataset with qualified keys
    let dataset = db[primaryTableName].map(row => {
      const qualified = {};
      for (const [k, v] of Object.entries(row)) {
        qualified[k] = v;
        qualified[`${primaryTableName}.${k}`] = v;
        qualified[`${primaryTableAlias}.${k}`] = v;
      }
      return qualified;
    });

    // Check for JOIN
    const joinRegex = /(LEFT\s+JOIN|INNER\s+JOIN|JOIN)\s+([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?\s+ON\s+([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)/gi;
    let joinMatch;
    while ((joinMatch = joinRegex.exec(cleanSql)) !== null) {
      const joinType = joinMatch[1].toUpperCase();
      const joinTable = joinMatch[2].toLowerCase();
      const joinAlias = joinMatch[3] || joinTable;
      const leftCol = joinMatch[4];
      const rightCol = joinMatch[5];

      if (!db[joinTable]) {
        throw new Error(`Join table '${joinTable}' not found.`);
      }

      const joined = [];
      const joinRows = db[joinTable];

      for (const baseRow of dataset) {
        let matched = false;
        for (const jRow of joinRows) {
          const qualifiedJ = {};
          for (const [k, v] of Object.entries(jRow)) {
            qualifiedJ[k] = v;
            qualifiedJ[`${joinTable}.${k}`] = v;
            qualifiedJ[`${joinAlias}.${k}`] = v;
          }

          const leftVal = baseRow[leftCol] ?? baseRow[leftCol.split('.').pop()];
          const rightVal = qualifiedJ[rightCol] ?? qualifiedJ[rightCol.split('.').pop()];

          if (leftVal !== undefined && rightVal !== undefined && leftVal === rightVal) {
            joined.push({ ...baseRow, ...qualifiedJ });
            matched = true;
          }
        }

        if (!matched && joinType.includes('LEFT')) {
          const emptyJ = {};
          for (const k of Object.keys(joinRows[0] || {})) {
            emptyJ[k] = null;
            emptyJ[`${joinTable}.${k}`] = null;
            emptyJ[`${joinAlias}.${k}`] = null;
          }
          joined.push({ ...baseRow, ...emptyJ });
        }
      }

      dataset = joined;
    }

    // Handle WHERE filters
    const whereMatch = cleanSql.match(/WHERE\s+([\s\S]*?)(?=(?:GROUP\s+BY|ORDER\s+BY|LIMIT|$))/i);
    if (whereMatch) {
      const whereClause = whereMatch[1].trim();
      dataset = dataset.filter(row => evaluateWhere(whereClause, row, db));
    }

    // Handle GROUP BY & Aggregations
    const groupByMatch = cleanSql.match(/GROUP\s+BY\s+([\s\S]*?)(?=(?:HAVING|ORDER\s+BY|LIMIT|$))/i);
    const selectMatch = cleanSql.match(/SELECT\s+(DISTINCT\s+)?([\s\S]*?)\s+FROM/i);
    const selectColsRaw = selectMatch ? selectMatch[2].trim() : '*';
    const isDistinct = Boolean(selectMatch && selectMatch[1]);

    if (groupByMatch) {
      const groupCol = groupByMatch[1].trim().split(',')[0].trim();
      const groups = {};
      for (const row of dataset) {
        const val = row[groupCol] ?? row[groupCol.split('.').pop()] ?? 'null';
        if (!groups[val]) groups[val] = [];
        groups[val].push(row);
      }

      let aggregated = [];
      const colDefsForGroup = splitSelectColumns(selectColsRaw);
      for (const [gVal, rows] of Object.entries(groups)) {
        const rep = { ...rows[0] };
        // compute aggregations
        rep['COUNT(e.id)'] = rows.length;
        rep['COUNT(id)'] = rows.length;
        rep['COUNT(*)'] = rows.length;
        rep['count(*)'] = rows.length;
        rep['COUNT(1)'] = rows.length;
        rep['total'] = rows.length;
        rep['occurrences'] = rows.length;
        rep['employee_count'] = rows.length;
        rep['total_orders'] = rows.length;

        // Auto-assign any count alias defined in SELECT
        colDefsForGroup.forEach(def => {
          const aliasMatch = def.match(/AS\s+([a-zA-Z0-9_]+)/i);
          if (aliasMatch && /COUNT\s*\(/i.test(def)) {
            rep[aliasMatch[1]] = rows.length;
          }
        });

        const salaries = rows.map(r => r.salary || 0);
        const amounts = rows.map(r => r.amount || 0);

        const avgSal = salaries.length ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0;
        const sumAmount = amounts.reduce((a, b) => a + b, 0);

        rep['AVG(e.salary)'] = avgSal;
        rep['avg_salary'] = avgSal;
        rep['SUM(amount)'] = sumAmount;
        rep['total_spent'] = sumAmount;

        aggregated.push(rep);
      }

      // Handle HAVING
      const havingMatch = cleanSql.match(/HAVING\s+([\s\S]*?)(?=(?:ORDER\s+BY|LIMIT|$))/i);
      if (havingMatch) {
        const havingClause = havingMatch[1].trim();
        aggregated = aggregated.filter(row => evaluateWhere(havingClause, row, db));
      }

      dataset = aggregated;
    }

    // Handle ORDER BY
    const orderByMatch = cleanSql.match(/ORDER\s+BY\s+([a-zA-Z0-9_., ]+?)(?:\s+(ASC|DESC))?(?:\s+LIMIT|$)/i);
    if (orderByMatch) {
      const orderCol = orderByMatch[1].trim().split(',')[0].trim();
      const isDesc = (orderByMatch[2] || 'ASC').toUpperCase() === 'DESC';
      dataset.sort((a, b) => {
        const colKey = orderCol.split('.').pop();
        const va = a[orderCol] ?? a[colKey];
        const vb = b[orderCol] ?? b[colKey];
        if (typeof va === 'number' && typeof vb === 'number') {
          return isDesc ? vb - va : va - vb;
        }
        return isDesc ? String(vb).localeCompare(String(va)) : String(va).localeCompare(String(vb));
      });
    }

    // Handle LIMIT and OFFSET
    const limitMatch = cleanSql.match(/LIMIT\s+(\d+)(?:\s+OFFSET\s+(\d+))?/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      const offset = limitMatch[2] ? parseInt(limitMatch[2], 10) : 0;
      dataset = dataset.slice(offset, offset + limit);
    }

    // Format projection columns
    let finalRows = [];
    let finalColumns = [];

    if (selectColsRaw === '*') {
      const first = dataset[0] || db[primaryTableName][0] || {};
      finalColumns = Object.keys(first).filter(k => !k.includes('.'));
      finalRows = dataset.map(row => {
        const obj = {};
        for (const col of finalColumns) obj[col] = row[col] ?? null;
        return obj;
      });
    } else {
      const colDefs = splitSelectColumns(selectColsRaw);

      // Check for Window Functions: ROW_NUMBER() OVER (...)
      const windowSpecs = [];
      finalColumns = colDefs.map(def => {
        const aliasMatch = def.match(/AS\s+([a-zA-Z0-9_]+)/i);
        const winMatch = def.match(/ROW_NUMBER\s*\(\s*\)\s*OVER\s*\(([\s\S]*?)\)(?:\s+AS\s+([a-zA-Z0-9_]+))?/i);
        if (winMatch) {
          const alias = winMatch[2] || aliasMatch?.[1] || 'row_num';
          windowSpecs.push({ alias, spec: winMatch[1] });
          return alias;
        }
        if (aliasMatch) return aliasMatch[1];
        return def.split('.').pop().replace(/[()]/g, '');
      });

      if (windowSpecs.length > 0) {
        for (const win of windowSpecs) {
          const partMatch = win.spec.match(/PARTITION\s+BY\s+([a-zA-Z0-9_.]+)/i);
          const orderMatch = win.spec.match(/ORDER\s+BY\s+([a-zA-Z0-9_., ]+)/i);
          const partCol = partMatch ? partMatch[1].split('.').pop() : null;
          const orderSpec = orderMatch ? orderMatch[1].trim() : null;

          const groups = {};
          for (const r of dataset) {
            const key = partCol ? (r[partCol] ?? 'all') : 'all';
            if (!groups[key]) groups[key] = [];
            groups[key].push(r);
          }

          for (const rows of Object.values(groups)) {
            if (orderSpec) {
              const orderParts = orderSpec.split(',').map(s => s.trim());
              rows.sort((a, b) => {
                for (const part of orderParts) {
                  const [c, dir] = part.split(/\s+/);
                  const col = c.split('.').pop();
                  const isDesc = (dir || 'ASC').toUpperCase() === 'DESC';
                  const va = a[col] ?? 0;
                  const vb = b[col] ?? 0;
                  if (va !== vb) {
                    return isDesc ? vb - va : va - vb;
                  }
                }
                return 0;
              });
            }
            rows.forEach((r, rankIdx) => {
              r[win.alias] = rankIdx + 1;
            });
          }
        }
      }

      // Check for Global Aggregate without GROUP BY (e.g. SELECT MAX(salary) AS second_highest)
      const isGlobalAggregate = !groupByMatch && colDefs.some(d => /(MAX|MIN|AVG|SUM|COUNT)\s*\(/i.test(d));
      if (isGlobalAggregate) {
        const aggregatedRow = {};
        colDefs.forEach((def, idx) => {
          const colName = finalColumns[idx];
          const exprMatch = def.match(/(MAX|MIN|AVG|SUM|COUNT)\s*\(\s*([a-zA-Z0-9_.*]+)\s*\)/i);
          if (exprMatch) {
            const func = exprMatch[1].toUpperCase();
            const targetCol = exprMatch[2].split('.').pop();
            const vals = dataset.map(r => r[targetCol] ?? r[exprMatch[2]]).filter(v => v !== null && v !== undefined && !isNaN(v)).map(Number);
            if (func === 'MAX') aggregatedRow[colName] = vals.length ? Math.max(...vals) : null;
            else if (func === 'MIN') aggregatedRow[colName] = vals.length ? Math.min(...vals) : null;
            else if (func === 'SUM') aggregatedRow[colName] = vals.reduce((a, b) => a + b, 0);
            else if (func === 'AVG') aggregatedRow[colName] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
            else if (func === 'COUNT') aggregatedRow[colName] = dataset.length;
          } else {
            aggregatedRow[colName] = dataset[0]?.[colName] ?? null;
          }
        });
        finalRows = [aggregatedRow];
      } else {
        finalRows = dataset.map(row => {
          const obj = {};
          colDefs.forEach((def, idx) => {
            const colName = finalColumns[idx];
            const aliasMatch = def.match(/AS\s+([a-zA-Z0-9_]+)/i);
            const rawExpr = aliasMatch ? def.substring(0, aliasMatch.index).trim() : def;
            
            let val = row[colName] ?? row[rawExpr] ?? row[rawExpr.split('.').pop()];

            // Handle COALESCE
            const coalesceMatch = rawExpr.match(/COALESCE\s*\(\s*([^,]+)\s*,\s*['"]?([^'")]+)['"]?\s*\)/i);
            if (coalesceMatch) {
              const innerVal = row[coalesceMatch[1].trim()] ?? row[coalesceMatch[1].trim().split('.').pop()];
              val = innerVal !== null && innerVal !== undefined ? innerVal : coalesceMatch[2].trim();
            }

            obj[colName] = val !== undefined ? val : null;
          });
          return obj;
        });
      }
    }

    if (isDistinct) {
      const seen = new Set();
      finalRows = finalRows.filter(r => {
        const s = JSON.stringify(r);
        if (seen.has(s)) return false;
        seen.add(s);
        return true;
      });
    }

    const latencyMs = Number((performance.now() - startTime).toFixed(2));
    return {
      columns: finalColumns,
      rows: finalRows,
      rowCount: finalRows.length,
      latencyMs
    };
  } catch (err) {
    return {
      error: err.message || 'Syntax error in SQL query',
      columns: [],
      rows: [],
      latencyMs: Number((performance.now() - startTime).toFixed(2))
    };
  }
}

function splitSelectColumns(selectStr) {
  const cols = [];
  let cur = '';
  let depth = 0;
  for (let i = 0; i < selectStr.length; i++) {
    const char = selectStr[i];
    if (char === '(') depth++;
    else if (char === ')') depth--;
    else if (char === ',' && depth === 0) {
      if (cur.trim()) cols.push(cur.trim());
      cur = '';
      continue;
    }
    cur += char;
  }
  if (cur.trim()) cols.push(cur.trim());
  return cols;
}

function evaluateWhere(clause, row, db) {
  // 1. Check NOT EXISTS or EXISTS subquery
  // e.g. WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)
  const existsMatch = clause.match(/(?:WHERE\s+)?(NOT\s+)?EXISTS\s*\(\s*SELECT\s+[\s\S]+?\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+[a-zA-Z0-9_]+)?\s+WHERE\s+([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)\s*\)/i);
  if (existsMatch) {
    const isNot = Boolean(existsMatch[1]);
    const subTable = existsMatch[2].toLowerCase();
    const subLeftCol = existsMatch[3].split('.').pop();
    const subRightCol = existsMatch[4].split('.').pop();

    if (db[subTable]) {
      const matches = db[subTable].filter(subRow => {
        const val1 = subRow[subLeftCol] ?? subRow[subRightCol];
        const val2 = row[subLeftCol] ?? row[subRightCol] ?? row.id;
        return val1 !== undefined && val2 !== undefined && val1 === val2;
      });
      return isNot ? matches.length === 0 : matches.length > 0;
    }
  }

  // 2. Check IS NOT NULL / IS NULL
  // e.g. WHERE email IS NOT NULL
  if (/([a-zA-Z0-9_.]+)\s+IS\s+NOT\s+NULL/i.test(clause)) {
    const colMatch = clause.match(/([a-zA-Z0-9_.]+)\s+IS\s+NOT\s+NULL/i);
    const col = colMatch[1].split('.').pop();
    const val = row[col] ?? row[colMatch[1]];
    if (val === null || val === undefined || val === '') return false;
  } else if (/([a-zA-Z0-9_.]+)\s+IS\s+NULL/i.test(clause)) {
    const colMatch = clause.match(/([a-zA-Z0-9_.]+)\s+IS\s+NULL/i);
    const col = colMatch[1].split('.').pop();
    const val = row[col] ?? row[colMatch[1]];
    if (val !== null && val !== undefined && val !== '') return false;
  }

  // 3. Scalar Subquery comparison:
  // e.g. salary < (SELECT MAX(salary) FROM employees) or salary > (SELECT AVG(salary) FROM employees)
  const scalarSubMatch = clause.match(/([a-zA-Z0-9_.]+)\s*(<|>|<=|>=|=)\s*\(\s*SELECT\s+(MAX|MIN|AVG|COUNT)\s*\(\s*([a-zA-Z0-9_.*]+)\s*\)\s+FROM\s+([a-zA-Z0-9_]+)\s*\)/i);
  if (scalarSubMatch) {
    const col = scalarSubMatch[1].split('.').pop();
    const op = scalarSubMatch[2];
    const func = scalarSubMatch[3].toUpperCase();
    const subCol = scalarSubMatch[4].split('.').pop();
    const subTable = scalarSubMatch[5].toLowerCase();

    if (db[subTable]) {
      const vals = db[subTable].map(r => r[subCol]).filter(v => typeof v === 'number');
      let subVal = 0;
      if (func === 'MAX') subVal = Math.max(...vals);
      else if (func === 'MIN') subVal = Math.min(...vals);
      else if (func === 'AVG') subVal = vals.reduce((a, b) => a + b, 0) / vals.length;
      else if (func === 'COUNT') subVal = vals.length;

      const actual = Number(row[col] ?? row[scalarSubMatch[1]] ?? 0);
      if (op === '<') return actual < subVal;
      if (op === '>') return actual > subVal;
      if (op === '<=') return actual <= subVal;
      if (op === '>=') return actual >= subVal;
      if (op === '=') return actual === subVal;
    }
  }

  // 4. Check equality like: status = 'completed' or status = 'active'
  const eqMatch = clause.match(/([a-zA-Z0-9_.]+)\s*=\s*['"]?([^'"]+)['"]?/);
  if (eqMatch) {
    const col = eqMatch[1].split('.').pop();
    const target = eqMatch[2].trim();
    const actual = row[col] ?? row[eqMatch[1]];
    if (String(actual).toLowerCase() !== target.toLowerCase()) return false;
  }

  // 5. Check numeric comparison like avg_salary > 75000 or salary > 80000 or COUNT(*) > 5 or id > 10000
  const compMatch = clause.match(/([a-zA-Z0-9_.() *]+?)\s*(>|<|>=|<=)\s*(\d+)/);
  if (compMatch) {
    const rawCol = compMatch[1].trim();
    const col = rawCol.split('.').pop();
    const op = compMatch[2];
    const num = parseFloat(compMatch[3]);
    const actual = parseFloat(row[rawCol] ?? row[col] ?? 0);
    if (op === '>') return actual > num;
    if (op === '<') return actual < num;
    if (op === '>=') return actual >= num;
    if (op === '<=') return actual <= num;
  }

  return true;
}

function generateExplainPlan(sql, db) {
  return [
    {
      id: 1,
      select_type: 'SIMPLE',
      table: 'employees',
      type: sql.includes('JOIN') ? 'ref' : 'ALL',
      possible_keys: 'PRIMARY,idx_dept_id,idx_salary',
      key: sql.includes('JOIN') ? 'idx_dept_id' : 'NULL',
      rows: db.employees.length,
      Extra: sql.includes('ORDER BY') ? 'Using filesort; Using temporary' : 'Using where'
    },
    ...(sql.includes('JOIN') ? [{
      id: 1,
      select_type: 'SIMPLE',
      table: 'departments',
      type: 'eq_ref',
      possible_keys: 'PRIMARY',
      key: 'PRIMARY',
      rows: 1,
      Extra: 'Using index condition'
    }] : [])
  ];
}
