reps_geojson := dist/actonmass_reps.geojson
reps_csv := cache/actonmass_reps.csv
house_geojson := cache/ma_house.geojson

.PHONY: all
all: $(reps_geojson)

$(reps_geojson): $(house_geojson) $(reps_csv)
	mkdir -p $(dir $@)
	npx mapshaper \
		$< -join $(word 2, $^) keys=district,district fields=pledge,vote \
		-filter-fields district,full_name,party,url,email,phone,pledge,vote \
		-style fill=gray fill-opacity=0.3 stroke=gray \
		-style fill=blue where="party === 'Democrat'" \
		-style fill=red where="party === 'Republican'" \
		-style fill-opacity=0.6 where="pledge === 'yes'" \
		-style fill=green where="vote === 'yes'" \
		-o $@
	@ls -lh $@

$(house_geojson):
	curl --create-dirs --output $@ \
		https://raw.githubusercontent.com/bhrutledge/ma-legislature/main/dist/$(notdir $@)

$(reps_csv):
	curl --create-dirs --output $@ --location \
		"https://docs.google.com/spreadsheets/d/1iY5wzVUpAKRHBF-vrwyUBz9_wV93FVqu4MW5viPSkas/export?gid=0&format=csv"

# TODO: Add distinct clean-dist and clean-cache, via clean-%, but see:
# https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html
.PHONY: clean
clean:
	rm -rf dist cache
