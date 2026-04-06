with open('./index (2).html', 'r', encoding='utf-8') as f:
    with open('./final_check_output.txt', 'w', encoding='utf-8') as out:
        for i, line in enumerate(f):
            if 'DESIGN' in line or 'Designer Gráfico' in line or 'comunicação' in line:
                out.write(f"Line {i+1}: {repr(line)}\n")
