with open('./index (2).html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'DESIGN' in line or 'Designer Gráfico' in line or 'comunicação' in line:
            print(f"Line {i+1}:", repr(line))
