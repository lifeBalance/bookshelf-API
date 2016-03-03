curl \
--header "Content-type: application/json" \
--request PATCH \
--data @patch-book.json \
--verbose \
http://localhost:8000/api/books/56d2f7d3ee9a7a645de13893
