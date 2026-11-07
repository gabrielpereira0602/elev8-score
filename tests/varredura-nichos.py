# Varredura de todas as telas em todos os nichos (precisa do sistema rodando em localhost:3100: npm run build && npx next start -p 3100).
# Procura texto de outro nicho, preço em setor que não permite, erros como "undefined" e tela mais larga que o celular.
import re
from playwright.sync_api import sync_playwright
nichos=['estetica','odontologia','advocacia','restaurante','academia','pet','beleza','loja','generico']
# palavras que só podem aparecer no próprio nicho
exclusivas={
 'estetica':['Bella Pele','Lumière','Clínica Aurora','Espaço Vitta','limpeza de pele','estética'],
 'odontologia':['Belo Sorriso','OdontoVita','clareamento','dentista'],
 'advocacia':['Moura Advocacia','advogado','OAB'],
 'restaurante':['Cantina da Nonna','Trattoria','almoço'],
 'academia':['Studio Move','pilates'],
 'pet':['Pet Vinhedo','Mundo Pet','banho e tosa'],
 'beleza':['Barbearia do Zé','barbearia'],
 'loja':['Flor de Lis','roupas femininas'],
 'generico':['Bellatrix','contabilidade'],
}
erros=[]
def checar(pg, nicho, rotulo):
    t=pg.inner_text('main')
    for outro,palavras in exclusivas.items():
        if outro==nicho: continue
        for w in palavras:
            if re.search(re.escape(w), t, re.I):
                erros.append(f'[{nicho}] {rotulo}: texto de "{outro}" -> "{w}"')
    for bug in ['undefined','NaN','[object','null']:
        if re.search(r'\b'+re.escape(bug)+r'\b', t): erros.append(f'[{nicho}] {rotulo}: "{bug}"')
    if nicho in ('advocacia','odontologia'):
        precos=[p for p in re.findall(r'R\$ ?\d[\d.]*\d|R\$ ?\d', t) if p.replace(' ','').replace('\xa0','') not in ('R$97','R$197','R$597','R$797','R$997','R$1.097','R$1.497','R$2.100')]
        if '/elev8' in rotulo: precos=[]  # faixas de orçamento da proposta da Elev8, não preço do cliente
        if precos: erros.append(f'[{nicho}] {rotulo}: preço em setor que não permite -> {precos[:3]}')
    w=pg.evaluate('document.documentElement.scrollWidth')
    if w>pg.viewport_size['width']: erros.append(f'[{nicho}] {rotulo}: tela mais larga que o viewport ({w}px)')
telas=0
with sync_playwright() as p:
    b=p.chromium.launch()
    for largura in (1280,390):
        pg=b.new_page(viewport={'width':largura,'height':900})
        for n in nichos:
            for pago in (False,True):
                q=f'?nicho={n}'+('&plano=pago' if pago else '')
                for aba in ['', '/diagnostico','/kit','/plano','/elev8','/assistente']:
                    pg.goto(f'http://localhost:3100/painel{aba}{q}'); pg.wait_for_timeout(150)
                    rot=f'{largura}px {"pago" if pago else "grátis"} {aba or "/visao-geral"}'
                    checar(pg,n,rot); telas+=1
                    if aba=='/kit' and pago:
                        for peca in ['WhatsApp que vende','Perfil reescrito','Google Perfil otimizado','12 posts prontos']:
                            pg.get_by_role('button', name=peca).click(); pg.wait_for_timeout(120)
                            if peca=='12 posts prontos':
                                for s in (2,3,4):
                                    checar(pg,n,rot+f' posts semana 1-{s}'); pg.get_by_role('tab', name=f'Semana {s}').click(); pg.wait_for_timeout(80)
                            checar(pg,n,rot+' '+peca); telas+=1
    b.close()
print(f'{telas} telas verificadas')
print('\n'.join(sorted(set(erros))) if erros else 'Nenhum problema encontrado')
