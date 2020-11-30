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
		-o $@
	@ls -lh $@

$(house_geojson):
	curl --create-dirs --output $@ \
		https://raw.githubusercontent.com/bhrutledge/ma-legislature/main/dist/$(notdir $@)

$(reps_csv):
	curl --create-dirs --output $@ --location \
		"https://docs.google.com/spreadsheets/d/1iY5wzVUpAKRHBF-vrwyUBz9_wV93FVqu4MW5viPSkas/export?gid=0&format=csv"

.PHONY: clean
clean:
	rm -rf $(reps_geojson) cache
