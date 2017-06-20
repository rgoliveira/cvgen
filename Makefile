TEMPL=./template.tex.mustache
OUT_DIR=./build
INSTALL_DIR=/home/rgoliveira/www/public_html

GEN=node index.js $(TEMPL)
DEF_ARGS=./no-lang.yaml

TEX=latex -halt-on-error -output-format pdf -output-directory $(OUT_DIR)

all: prep en

prep:
	@mkdir -p $(OUT_DIR)

en:
	$(GEN) $(OUT_DIR)/en.tex $(DEF_ARGS) en.yaml
	$(TEX) $(OUT_DIR)/en.tex

clean:
	@rm -rf $(OUT_DIR)
