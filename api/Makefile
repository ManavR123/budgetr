compile:
	g++ -DDATABASE_PGSQL -c main.cpp
	g++ -o main main.o category-odb.o purchase-odb.o -lodb-pgsql -lodb -lodb-boost -lboost_date_time -lpthread -lboost_system

run:
	./main - --database budgetr --port 5433 --user manav

purchase: purchase/purchase.h
	odb -o purchase/ -d pgsql --profile boost  --generate-query --generate-schema purchase/purchase.h
	c++ -c purchase/purchase-odb.cxx
