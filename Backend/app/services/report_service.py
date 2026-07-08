def build_report_html(result: dict) -> str:
    stack_items = "".join(f"<li><strong>{item['role']}:</strong> {item['name']} ({item['confidence']}%) - {item['explanation']}</li>" for item in result["recommended_stack"])
    feature_items = "".join(f"<li><strong>{item['feature']}:</strong> {item['reason']}</li>" for item in result["feature_recommendations"])
    cost_rows = "".join(f"<tr><td>{name.title()}</td><td>${amount}</td></tr>" for name, amount in result["cost_estimate"]["breakdown"].items())
    return f'''<!doctype html>
<html>
<head><meta charset="utf-8"><title>StackWise Architecture Report</title><style>body{{font-family:Arial,sans-serif;line-height:1.5;margin:40px;color:#17202a}} h1,h2{{color:#0f766e}} table{{border-collapse:collapse;width:100%}}td,th{{border:1px solid #d0d7de;padding:8px}}</style></head>
<body>
  <h1>StackWise Architecture Report</h1>
  <p>{result["summary"]}</p>
  <h2>Recommended Architecture</h2>
  <p><strong>{result["architecture"]["pattern"]}</strong>: {result["architecture"]["reason"]}</p>
  <pre>{result["architecture"]["mermaid"]}</pre>
  <h2>Recommended Stack</h2>
  <ul>{stack_items}</ul>
  <h2>Feature Recommendations</h2>
  <ul>{feature_items}</ul>
  <h2>Cost Breakdown</h2>
  <table><tbody>{cost_rows}</tbody></table>
  <p><strong>Monthly:</strong> ${result["cost_estimate"]["monthly_total"]} | <strong>Annual:</strong> ${result["cost_estimate"]["annual_total"]} | <strong>Development:</strong> ${result["cost_estimate"]["development_total"]}</p>
</body></html>'''
